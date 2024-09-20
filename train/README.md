# AI model

This project currently uses only the [MusicGen Meta model](https://github.com/facebookresearch/audiocraft) as a base model, fine-tuned with some specific beats based on style and expected results.

This directory contains scripts for fine-tuning the base models using parameters that I've found to work well.

##### Prerequisites

You need to have `build-essential` installed:

```bash
apt install build-essential
```

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

# or if you want it to run in the background
nohup python fine_tune.py > fine_tune.log 2> fine_tune.err < /dev/null &
```

5. Export the model by first acquiring the model's configuration signature with from the `audiocraft/` directory:

```bash
dora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=//pretrained/facebook/musicgen-small conditioner=text2music dset=audio/custom
```

This command should be basically the same as the `dora run` command used in `fine_tune.py`. If you change it for any reason, or change the yaml config, you need to alter this info command as well.

After running the command run:

```bash
python export_model.py
```

You can also set the signature (can find it from the `dora info`) command in `export_model.py` directly to be used every time.

6. Don't forget to deactivate the venv when done

```bash
deactivate
```

### Troubleshooting

#### python version

The official audiocraft documentation states that only python 3.9 is supported. I did not run into issues related to python version in kaggle where python was version 3.10. But for any unexpected issues try changing the python version to one of these two.

#### GPU memory

Fine-tuning the smallest model only worked with two GPUs with 30GB memory in total in kaggle. Anything smaller was not enough memory.

Additionally, I had to set `batch_size` to 2, otherwise I was getting a not enough memory error as well.

#### division by zero error

At the beginning I was getting a cosine division by zero error after the training step had just ended and it went to evaluation. I fixed it by decreasing the `warmup` value in the cosine scheduler config.
