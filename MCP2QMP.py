import json
import socket

class QMPPathProxy:
    def __init__(self, client, path="$"):
        object.__setattr__(self, "_client", client)
        object.__setattr__(self, "_path", path)

    def __getattr__(self, name):
        # Dot-Notation -> JSONPath Child Operator
        new_path = f"{self._path}.{name}"
        return QMPPathProxy(self._client, new_path)

    def __getitem__(self, key):
        # Index-Notation (z.B. CPUs oder Arrays) -> JSONPath Subscript
        if isinstance(key, int):
            new_path = f"{self._path}[{key}]"
        else:
            new_path = f"{self._path}['{key}']"
        return QMPPathProxy(self._client, new_path)

    def __call__(self, **kwargs):
        # Ausführung des akkumulierten JSONPath gegen den QMP-Zustand
        return self._client.query_path(object.__getattribute__(self, "_path"), **kwargs)

    def __repr__(self):
        # Lazy Evaluation beim Drucken/Inspizieren
        res = self._client.query_path(object.__getattribute__(self, "_path"))
        return repr(res)

class MCPQMPClient:
    def __init__(self, socket_path):
        self.socket_path = socket_path

    def execute_raw(self, cmd_dict):
        with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as s:
            s.connect(self.socket_path)
            s.recv(1024) # Greeting
            s.sendall(json.dumps(cmd_dict).encode() + b"\n")
            return json.loads(s.recv(4096).decode())

    def query_path(self, jspath):
        # Hier würde die QMP-Antwort (z.B. query-status oder query-cpus) geholt 
        # und mittels einer JSONPath-Bibliothek (wie `jsonpath-ng`) ausgewertet werden.
        raw_data = self.execute_raw({"execute": "query-status"}) # Beispiel
        # Dummy-Beispiel für die Demonstration
        return {"status": {"running": True, "singlestep": False}}

    @property
    def q(self):
        # Einstiegspunkt für die Dunder-DSL
        return QMPPathProxy(self, "$")
