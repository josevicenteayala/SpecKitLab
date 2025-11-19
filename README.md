# SpecKitLab

This repository serves as a workspace for creating and managing multiple applications using Spec-kit, a UI framework for Pharo Smalltalk.

## Repository Structure

```
SpecKitLab/
├── apps/           # Your custom Spec-kit applications
├── examples/       # Example applications demonstrating Spec-kit features
├── docs/           # Documentation and guides
└── README.md       # This file
```

## Getting Started

### Prerequisites

- Pharo 11 or later
- Basic knowledge of Smalltalk and Spec-kit

### Creating a New Application

1. Create a new directory in the `apps/` folder:
   ```
   apps/YourAppName/
   ```

2. Each application should contain:
   - `README.md` - Application documentation
   - `src/` - Source code directory
   - `baseline/` - Baseline configuration for Metacello

3. Follow the Spec-kit conventions for creating presenters and models

### Loading Applications

Applications in this repository can be loaded using Metacello in Pharo:

```smalltalk
Metacello new
    baseline: 'YourAppName';
    repository: 'gitlocal://path/to/SpecKitLab/apps/YourAppName';
    load.
```

## Example Applications

Check the `examples/` directory for sample applications demonstrating:
- Basic Spec-kit presenters
- Layout management
- Event handling
- Model-view separation

## Documentation

The `docs/` directory contains:
- Spec-kit best practices
- Application templates
- Common patterns and examples

## Contributing

When adding a new application:
1. Create a dedicated directory under `apps/`
2. Include a README with installation and usage instructions
3. Follow Pharo and Spec-kit coding conventions
4. Add tests for your presenters and models

## Resources

- [Pharo](https://pharo.org/)
- [Spec-kit Documentation](https://github.com/pharo-spec/Spec)
- [Pharo Books](https://books.pharo.org/)

## License

This repository is provided as-is for learning and exploration purposes.
