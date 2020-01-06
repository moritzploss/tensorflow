import json
import matplotlib.pyplot as plt

with open("./regressionValidation.json", "r") as data_file:
    validationData = json.load(data_file)

    with open("./regressionInput.json", "r") as input_file:
        inputData = json.load(input_file)

        plt.scatter(
            inputData['horsepowers'],
            inputData['mpgs'],
            color='#aaaaaa',
            label='training data'
        )

        plt.plot(
            validationData['validationInputs'],
            validationData['validationResults'],
            label='prediction'
        )

        plt.xlim((0, max(inputData['horsepowers']) * 1.1))
        plt.ylim((0, max(inputData['mpgs']) * 1.1))

        plt.xlabel('horsepower')
        plt.ylabel('miles per galon')

        plt.legend()
        plt.tight_layout()
        plt.savefig('./regression.png', dpi=300)