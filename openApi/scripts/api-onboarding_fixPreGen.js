const fs = require('fs');

// gen-api-models supports a single formData parameter per operation, which it assumes to be
// the uploaded file. When an operation declares more than one, it picks the first and emits
// a reference to a non-existent `<name>_` variable, breaking the build.
// Keep only the binary parameter for such operations.
const specPath = 'openApi/generated-onboarding/onboarding-swagger20.json';
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));

Object.values(spec.paths ?? {}).forEach((path) =>
  Object.values(path).forEach((operation) => {
    const parameters = operation?.parameters;
    if (!Array.isArray(parameters)) {
      return;
    }
    const formData = parameters.filter((parameter) => parameter.in === 'formData');
    if (formData.length < 2) {
      return;
    }
    const file = formData.find((parameter) => parameter.format === 'binary');
    if (!file) {
      return;
    }
    operation.parameters = parameters.filter(
      (parameter) => parameter.in !== 'formData' || parameter === file
    );
  })
);

fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));