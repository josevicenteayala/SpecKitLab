# Getting Started with SpecKitLab

This guide will help you start creating Spec-kit applications in the SpecKitLab repository.

## What is Spec-kit?

Spec-kit (or simply "Spec") is a framework for building user interfaces in Pharo Smalltalk. It provides:
- A declarative way to define UIs
- Reusable UI components (presenters)
- Layout management
- Event handling
- Separation between UI and business logic

## Prerequisites

Before you begin, make sure you have:

1. **Pharo Installed**: Download from [pharo.org](https://pharo.org/)
   - Recommended: Pharo 11 or later
   - Includes the Spec framework by default

2. **Basic Smalltalk Knowledge**: 
   - Understand classes and methods
   - Familiar with the Pharo IDE
   - Know how to use the Playground

3. **Git**: To clone and manage this repository

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/josevicenteayala/SpecKitLab.git
cd SpecKitLab
```

### 2. Explore the Structure

```
SpecKitLab/
├── apps/           # Create your applications here
├── examples/       # Learn from example applications
├── docs/           # Documentation and guides
└── README.md
```

### 3. Try the Example

Open Pharo and load the HelloWorld example:

```smalltalk
"In a Pharo Playground, execute:"
Metacello new
    baseline: 'HelloWorld';
    repository: 'gitlocal:///path/to/SpecKitLab/examples/HelloWorld';
    load.
```

Then run it:

```smalltalk
HelloWorldPresenter new open
```

### 4. Create Your First Application

Follow the [Application Template Guide](APPLICATION_TEMPLATE.md) to create your own application.

## Basic Spec-kit Concepts

### Presenters

Presenters are the building blocks of Spec UIs. They:
- Define the structure of your UI
- Handle user interactions
- Connect to your application's models

```smalltalk
MyAppPresenter >> initializePresenters
    button := self newButton
        label: 'Click me';
        action: [ self doSomething ];
        yourself
```

### Layouts

Layouts define how presenters are arranged:

```smalltalk
MyAppPresenter >> defaultLayout
    ^ SpBoxLayout newVertical
        add: #label;
        add: #button;
        yourself
```

### Opening Windows

```smalltalk
"Simple open"
MyAppPresenter new open

"With custom size"
MyAppPresenter new 
    openWithSpec;
    withWindowDo: [ :w | w extent: 400@300 ]
```

## Workflow

1. **Create** a new directory under `apps/` for your project
2. **Define** your presenters and models
3. **Set up** a baseline for dependency management
4. **Load** your application using Metacello
5. **Test** by opening your presenters
6. **Iterate** on your design

## Common Tasks

### Add a Button

```smalltalk
button := self newButton
    label: 'Click me';
    action: [ self inform: 'Clicked!' ];
    yourself
```

### Add a Text Input

```smalltalk
textInput := self newTextInput
    placeholder: 'Enter text...';
    yourself
```

### Add a Label

```smalltalk
label := self newLabel
    label: 'Hello!';
    yourself
```

### Add a List

```smalltalk
list := self newList
    items: #('Item 1' 'Item 2' 'Item 3');
    yourself
```

## Next Steps

1. Study the example in `examples/HelloWorld/`
2. Read the [Application Template Guide](APPLICATION_TEMPLATE.md)
3. Create your first application in `apps/`
4. Explore more Spec features in the [Pharo documentation](https://github.com/pharo-spec/Spec)

## Useful Resources

- [Spec Documentation](https://github.com/pharo-spec/Spec)
- [Pharo by Example](http://books.pharo.org/)
- [Building UI with Spec](https://github.com/SquareBracketAssociates/BuildingUIWithSpec)
- [Pharo Discord](https://discord.gg/QewZMZa)

## Tips

1. **Use the Playground**: Test code snippets quickly
2. **Explore the System Browser**: Learn from existing Spec classes
3. **Read the Source**: Pharo's source code is accessible and readable
4. **Ask for Help**: The Pharo community is friendly and helpful

## Troubleshooting

### Application Won't Load

- Check that the baseline path is correct
- Verify that all required packages exist
- Look for syntax errors in your code

### Layout Issues

- Ensure all instance variables are initialized
- Check that layout selectors match instance variable names
- Use `yourself` to return the layout object

### Window Not Opening

- Make sure your presenter inherits from SpPresenter
- Check that `initializePresenters` is properly defined
- Verify that `defaultLayout` returns a valid layout

## Getting Help

If you encounter issues:
1. Check the `examples/` directory for working code
2. Read the documentation in `docs/`
3. Consult the official Spec documentation
4. Ask the Pharo community on Discord or forums

Happy coding with Spec-kit!
