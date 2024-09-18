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

4. Run the fine tuning script

```bash
python fine_tune.py
```

5. Export the model by first acquiring the model's configuration signature with:

```bash
dora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=//pretrained/facebook/musicgen-small conditioner=text2music dset=audio/custom
```

This command should be basically the same as the `dora run` command used in `fine_tune.py`. If you change it for any reason, or change the yaml config, you need to alter this info command as well.

After running the command, set the signature it returns in `export_model.py`, and run:

```bash
python export_model.py
```

6. Don't forget to deactivate the venv when done

```bash
deactivate
```
