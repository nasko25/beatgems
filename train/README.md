# AI model

This project currently uses only the [MusicGen Meta model](https://github.com/facebookresearch/audiocraft) as a base model, fine-tuned with some specific beats based on style and expected results.

This directory contains scripts for fine-tuning the base models using parameters that I've found to work well.

### Running

1. Install the required submodules

```bash
git submodule init
git submodule update
```

2. Create and activate a new python virtual environment

```bash
python3 -m venv ~/Documents/python-envs/beatgems
source ~/Documents/python-envs/beatgems/bin/activate
```

3. Install the required libraries

```bash
python -m pip install -r requirements.txt
```

<mark>TODO: some configuration steps?</mark>

4. Run the fine tuning script

```bash
python fine_tune.py
```

5. Don't forget to deactivate the venv when done

```bash
deactivate
```
