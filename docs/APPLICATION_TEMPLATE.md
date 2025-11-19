# Application Template Guide

This guide explains how to create a new Spec-kit application in this repository.

## Directory Structure

Each application should follow this structure:

```
apps/YourAppName/
├── README.md
├── src/
│   └── YourAppName/
│       ├── YourAppNamePresenter.class.st
│       ├── YourAppNameModel.class.st
│       └── package.st
└── baseline/
    └── BaselineOfYourAppName/
        ├── BaselineOfYourAppName.class.st
        └── package.st
```

## Creating a New Application

### 1. Set Up Directory Structure

```bash
mkdir -p apps/MyApp/src/MyApp
mkdir -p apps/MyApp/baseline/BaselineOfMyApp
```

### 2. Create the Application README

Create `apps/MyApp/README.md`:

```markdown
# MyApp

Brief description of your application.

## Installation

\`\`\`smalltalk
Metacello new
    baseline: 'MyApp';
    repository: 'gitlocal://path/to/SpecKitLab/apps/MyApp';
    load.
\`\`\`

## Usage

Instructions on how to use your application.
```

### 3. Create the Baseline

Create `apps/MyApp/baseline/BaselineOfMyApp/BaselineOfMyApp.class.st`:

```smalltalk
Class {
    #name : #BaselineOfMyApp,
    #superclass : #BaselineOf,
    #category : #BaselineOfMyApp
}

{ #category : #baselines }
BaselineOfMyApp >> baseline: spec [
    <baseline>
    spec for: #common do: [
        spec package: 'MyApp'
    ]
]
```

### 4. Create Your Presenter

Create `apps/MyApp/src/MyApp/MyAppPresenter.class.st`:

```smalltalk
Class {
    #name : #MyAppPresenter,
    #superclass : #SpPresenter,
    #instVars : [
        'textInput',
        'button',
        'label'
    ],
    #category : #MyApp
}

{ #category : #specs }
MyAppPresenter class >> defaultSpec [
    ^ SpBoxLayout newVertical
        add: #label;
        add: #textInput;
        add: #button;
        yourself
]

{ #category : #initialization }
MyAppPresenter >> initializePresenters [
    label := self newLabel
        label: 'Enter text:';
        yourself.
    
    textInput := self newTextInput.
    
    button := self newButton
        label: 'Click me';
        action: [ self onButtonClick ];
        yourself.
]

{ #category : #actions }
MyAppPresenter >> onButtonClick [
    self inform: 'You entered: ', textInput text
]

{ #category : #api }
MyAppPresenter >> title [
    ^ 'My App'
]
```

### 5. Create Package Metadata

Create `apps/MyApp/src/MyApp/package.st`:

```smalltalk
Package { #name : #MyApp }
```

Create `apps/MyApp/baseline/BaselineOfMyApp/package.st`:

```smalltalk
Package { #name : #BaselineOfMyApp }
```

## Best Practices

1. **Naming Conventions**: Use clear, descriptive names for your classes
2. **Separation of Concerns**: Keep UI logic in presenters, business logic in models
3. **Testing**: Write tests for your models and presenters
4. **Documentation**: Document public APIs and complex logic
5. **Version Control**: Commit frequently with clear messages

## Common Patterns

### Opening Your Application

```smalltalk
MyAppPresenter new open
```

### With Initial Extent

```smalltalk
MyAppPresenter new 
    openWithSpec;
    withWindowDo: [ :w | w extent: 400@300 ]
```

### Modal Dialog

```smalltalk
MyAppPresenter new openModal
```

## Resources

- [Spec-kit Documentation](https://github.com/pharo-spec/Spec)
- [Pharo by Example](http://books.pharo.org/)
- [Spec Tutorial](https://github.com/SquareBracketAssociates/BuildingUIWithSpec)
