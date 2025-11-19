# Applications

This directory is where you create your custom Spec-kit applications.

## Creating a New Application

1. Create a new directory with your application name:
   ```bash
   mkdir -p apps/MyApp
   ```

2. Follow the structure described in [docs/APPLICATION_TEMPLATE.md](../docs/APPLICATION_TEMPLATE.md)

3. Implement your presenters and models

4. Load your application in Pharo using Metacello

## Directory Structure

Each application should follow this structure:

```
apps/YourApp/
├── README.md              # Application documentation
├── src/                   # Source code
│   └── YourApp/
│       ├── package.st
│       └── *.class.st     # Your Smalltalk classes
└── baseline/              # Metacello baseline
    └── BaselineOfYourApp/
        ├── package.st
        └── BaselineOfYourApp.class.st
```

## Tips

- Give your application a descriptive name
- Include clear installation and usage instructions in the README
- Follow Pharo naming conventions (PascalCase for classes)
- Keep each application self-contained
- Consider adding tests in a separate package

## Examples

See the `examples/` directory for sample applications that demonstrate best practices.

## Resources

- [Application Template Guide](../docs/APPLICATION_TEMPLATE.md)
- [Getting Started Guide](../docs/GETTING_STARTED.md)
- Main [README](../README.md)
