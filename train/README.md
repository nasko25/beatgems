# AI model

This project currently uses only the [MusicGen Meta model](https://github.com/facebookresearch/audiocraft) as a base model, fine-tuned with some specific beats based on style and expected results.

This directory contains scripts for fine-tuning the base models using parameters that I've found to work well.

##### Prerequisites

You need to have `build-essential` installed:

```bash
apt install build-essential

# in order to build scipy you also need
apt install libblas3 liblapack3 liblapack-dev libblas-dev gfortran libatlas-base-dev

# and for numpy (it needs to import python in C compilation)
apt install python3.10-dev python3.9-dev
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
nohup python fine_tune.py -m 3 > fine_tune.log 2> fine_tune.err < /dev/null &
```

5. Export the model by first acquiring the model's configuration signature with from the `audiocraft/` directory:

```bash
dora info solver=musicgen/musicgen_base_32khz_custom.yaml model/lm/model_scale=small continue_from=//pretrained/facebook/musicgen-small conditioner=text2music dset=audio/custom
```

This command should be basically the same as the `dora run` command used in `fine_tune.py`. If you change it for any reason, or change the yaml config, you need to alter this info command as well.

After running the command run:

```bash
# these are important because the audiocraft dependency in this script expects to find the audiocraft/tmp/... directory
cp export_model.py audiocraft/
cd audiocraft/

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

In case `python` is liked to `python3.11` or above, you have to use `python3.9`/`python3.10`! I had a `scipy` `meson` build issue with python 3.11

Always use a virtual environment, even if it's a rented instance! Because you can always inspect the exact versions of packages used and troubleshoot based on that. I had many issues due to mismatch of package/python versions, and weird globally installed package versions that refused to update.

##### downgrading python to 3.9

1. Install libraries needed by `pyenv`:

```bash
apt-get install zlib1g-dev libffi-dev libssl-dev libbz2-dev libreadline-dev libsqlite3-dev liblzma-dev libncurses-dev tk-dev
```

2. Install `pyenv`: https://github.com/pyenv/pyenv?tab=readme-ov-file#automatic-installer

```bash
curl https://pyenv.run | bash
```

3. Install and set python 3.9.9 environment

```bash
pyenv install 3.9.20
pyenv local 3.9.20
pyenv exec python -m venv ~/Documents/python-envs/beatgems
source ~/Documents/python-envs/beatgems/bin/activate
```

#### GPU memory

Fine-tuning the smallest model only worked with two GPUs with 30GB memory in total in kaggle. Anything smaller was not enough memory.

Additionally, I had to set `batch_size` to 2, otherwise I was getting a not enough memory error as well.

#### division by zero error

At the beginning I was getting a cosine division by zero error after the training step had just ended and it went to evaluation. I fixed it by decreasing the `warmup` value in the cosine scheduler config.

#### fortran compiler missing

I had this weird error when running the fine-tuning script. It happened on the `/opt/conda/bin/python -m pip install -e .` step:

```
../../meson.build:41:0: ERROR: Unknown compiler(s): [['gfortran'], ['flang'], ['nvfortran'], ['pgfortran'], ['ifort'], ['g95']]
```

Next, I got this:

```
../../scipy/meson.build:130:0: ERROR: Pkg-config binary for machine 1 not found. Giving up.
```

And after that I got:

```
../../scipy/meson.build:130:0: ERROR: Dependency "OpenBLAS" not found, tried pkgconfig and cmake
```

I fixed them with these 3 commands respectively:

```bash
sudo apt-get install gfortran
sudo apt-get install pkg-config
sudo apt-get install python3-pkgconfig libopenblas-dev # https://github.com/scipy/scipy/issues/16308#issuecomment-1647348653
```

Also at the start don't forget to:

```bash
sudo apt-get update
sudo apt-get upgrade
```

After that I got some fortran build error. Turns out it was likely due to the [python version](#python-version).

#### Training data initialization timeout

I got this error when initializing the training data took >30min to complete:

```
[flashy.solver][INFO] - Ignoring keys when loading best []
[E ProcessGroupNCCL.cpp:474] [Rank 0] Watchdog caught collective operation timeout: WorkNCCL(SeqNum=1, OpType=ALLREDUCE, NumelIn=2, NumelOut=2, Timeout(ms)=1800000) ran for 1800646 mil
liseconds before timing out.
[E ProcessGroupNCCL.cpp:488] Some NCCL operations have failed or timed out. Due to the asynchronous nature of CUDA kernels, subsequent GPU operations might run on corrupted/incomplete
data.
[E ProcessGroupNCCL.cpp:494] To avoid data inconsistency, we are taking the entire process down.
[E ProcessGroupNCCL.cpp:915] [Rank 0] NCCL watchdog thread terminated with exception: [Rank 0] Watchdog caught collective operation timeout: WorkNCCL(SeqNum=1, OpType=ALLREDUCE, NumelI
n=2, NumelOut=2, Timeout(ms)=1800000) ran for 1800646 milliseconds before timing out.
terminate called after throwing an instance of 'std::runtime_error'
  what():  [Rank 0] NCCL watchdog thread terminated with exception: [Rank 0] Watchdog caught collective operation timeout: WorkNCCL(SeqNum=1, OpType=ALLREDUCE, NumelIn=2, NumelOut=2, T
imeout(ms)=1800000) ran for 1800646 milliseconds before timing out.
Executor: Worker 0 died, killing all workers
```

I was not able to fix it, perhaps it just needs more time, but it is getting too expensive for me to wait for it for too long given all uncertainties.
[This issue](https://github.com/ultralytics/ultralytics/issues/1439) lead me to believe that the dataset is just too large, so I removed the last dataset from `fine_tune.py` and it proceeded without throwing this error.

I am testing it locally and it took 27 minutes after the `[audiocraft.modules.codebooks_patterns][INFO] - New pattern, time steps: 1500, sequence steps: 1504` log for the first Training log to appear. But the good news is that `small` model fine-tuning works on a 3070 with 8GB of memory for now.

#### Memory filled

My fine-tuning script crashed once because the RAM and swap partition got filled up. I have not 100% confirmed this was the issue, but swap was 100% full and every time I tried to rerun it, the kernel kept killing the fine-tuning process.

I fixed it by adding a little bit more RAM (by increasing my VM allocation) and clearing everything stored on the swap partition (basically by restarting my local instance).
