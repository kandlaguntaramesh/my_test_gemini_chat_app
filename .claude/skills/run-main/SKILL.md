---
name: run-main
description: Run this project's main.py entry point via uv. Use when the user asks to run, start, or execute the project/main script.
---

Run the project's entry point:

```
uv run src/main.py
```

Report the command's stdout/stderr back to the user. If `uv` is not available, fall back to:

```
python src/main.py
```
