# Examples

This directory contains example Spec-kit applications that demonstrate various features and best practices.

## Available Examples

### HelloWorld

A simple "Hello World" application that demonstrates:
- Basic presenter structure
- Button and label components
- Event handling
- Window initialization

**Location**: `examples/HelloWorld/`

**To run**:
```smalltalk
Metacello new
    baseline: 'HelloWorld';
    repository: 'gitlocal:///path/to/SpecKitLab/examples/HelloWorld';
    load.

HelloWorldPresenter new open
```

## Using Examples

Each example includes:
- **README.md**: Description and instructions
- **Source code**: Commented Smalltalk classes
- **Baseline**: For loading with Metacello

## Learning Path

1. Start with **HelloWorld** to understand basic concepts
2. Examine the source code to see how presenters are structured
3. Modify the examples to experiment with different features
4. Use examples as templates for your own applications

## Contributing Examples

If you create an interesting Spec-kit application, consider adding it to this directory:

1. Create a new subdirectory under `examples/`
2. Follow the standard application structure
3. Include clear documentation and comments
4. Focus on demonstrating specific features or patterns

## Next Steps

After exploring the examples:
- Read the [Getting Started Guide](../docs/GETTING_STARTED.md)
- Check the [Application Template Guide](../docs/APPLICATION_TEMPLATE.md)
- Create your own application in the `apps/` directory
