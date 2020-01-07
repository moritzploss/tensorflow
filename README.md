# Machine Learning with TensorFlow

## About

This repo contains small projects built with `TensorFlow`.

## Get Started

Install required libraries for `Node` and `Python 3`:

    npm i
    pip install -r requirements.txt

## Models

#### Regression Model

To run the regression model:

    node dist/regression.js

To visualize the results:

    cd data
    python3 plot_data.py

## Data Visualization

Graph data is logged to the `tensorboard` directory. To launch the visualization server, run:

    tensorboard --logdir ./tensorboard

You may need to install `tensorboard` first:

    pip install tensorboard

## Troubleshooting

If you get an error along the lines of

    Error: Cannot find module '../@tensorflow/tfjs-node/lib/napi-v5/tfjs_binding.node'

try the following:

    npm rebuild @tensorflow/tfjs-node --build-from-source

If this fails with a `node-gyp` error, try running the following in your `$HOME` directory:

    rm -r .node-gyp
    npm install --global node-gyp

If this fails (on macOS), make sure you have the `xcode cli` tools installed:

    xcode-select --install