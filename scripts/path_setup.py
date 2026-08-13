"""Resolve script directory in .py files and Jupyter/Kaggle notebooks."""
from __future__ import annotations

from pathlib import Path
import sys

try:
    SCRIPT_DIR = Path(__file__).resolve().parent
except NameError:
    # Jupyter / Kaggle / IPython
    SCRIPT_DIR = Path.cwd()

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
