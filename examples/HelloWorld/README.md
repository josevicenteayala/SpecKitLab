# HelloWorld Example

A simple "Hello World" application demonstrating basic Spec-kit usage.

## Description

This example shows:
- Creating a basic presenter with a label and button
- Handling button click events
- Opening a Spec application window

## Installation

In a Pharo image, execute:

```smalltalk
Metacello new
    baseline: 'HelloWorld';
    repository: 'gitlocal://path/to/SpecKitLab/examples/HelloWorld';
    load.
```

Replace `path/to/SpecKitLab` with the actual path to your SpecKitLab directory.

## Usage

To open the application:

```smalltalk
HelloWorldPresenter new open
```

## Features

- Simple button that displays a greeting
- Basic Spec-kit presenter structure
- Example of event handling

## Learning Points

This example demonstrates:
1. Creating a SpPresenter subclass
2. Defining presenters (button, label)
3. Setting up layout
4. Handling user interactions
5. Opening a window

## Next Steps

After understanding this example, explore:
- Adding more complex layouts
- Using different presenter types
- Creating reusable components
- Adding models for business logic
