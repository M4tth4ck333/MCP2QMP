import ast
from pathlib import Path
import json

class DOMNode:
    def __init__(self, name: str, node_type: str, children=None, bases=None):
        self.name = name
        self.node_type = node_type  # 'directory', 'file', 'class', 'function'
        self.children = children or []
        self.bases = bases or []    # Erbt-von-Klassen (wichtig für PyBoy Plugins/ABC)

    def to_dict(self):
        res = {
            "name": self.name,
            "type": self.node_type,
            "children": [c.to_dict() for c in self.children]
        }
        if self.bases:
            res["bases"] = self.bases
        return res

def parse_python_file(file_path: Path) -> DOMNode:
    """Parst PyBoy-kompatible Python-Dateien mit Klassen, Methoden und Vererbungen."""
    file_node = DOMNode(file_path.name, "file")
    try:
        source_code = file_path.read_text(encoding="utf-8")
        tree = ast.parse(source_code)
        
        for body_node in tree.body:
            if isinstance(body_node, ast.ClassDef):
                # Vererbungen (z.B. PyBoyGameWrapper oder ABC) extrahieren
                bases = []
                for base in body_node.bases:
                    if isinstance(base, ast.Name):
                        bases.append(base.id)
                    elif isinstance(base, ast.Attribute):
                        bases.append(base.attr)
                        
                class_node = DOMNode(body_node.name, "class", bases=bases)
                
                for sub in body_node.body:
                    if isinstance(sub, (ast.FunctionDef, ast.AsyncFunctionDef)):
                        func_type = "async_function" if isinstance(sub, ast.AsyncFunctionDef) else "function"
                        class_node.children.append(DOMNode(sub.name, func_type))
                        
                file_node.children.append(class_node)
                
            elif isinstance(body_node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                func_type = "async_function" if isinstance(body_node, ast.AsyncFunctionDef) else "function"
                file_node.children.append(DOMNode(body_node.name, func_type))
                
    except Exception as e:
        file_node.children.append(DOMNode(f"error: {str(e)}", "error"))
        
    return file_node

def repo_to_dom(root_path: Path) -> DOMNode:
    root_node = DOMNode(root_path.name, "directory")
    for path in sorted(root_path.iterdir()):
        if path.name.startswith('.'):
            continue
        if path.is_dir():
            root_node.children.append(repo_to_dom(path))
        elif path.suffix == '.py':
            root_node.children.append(parse_python_file(path))
    return root_node
