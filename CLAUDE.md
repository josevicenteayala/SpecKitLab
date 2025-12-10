# CLAUDE.md - AI Assistant Guide for SpecKitLab

This document provides comprehensive guidance for AI assistants working with the SpecKitLab repository.

## Project Overview

**SpecKitLab** is a workspace and learning repository for creating UI applications using **Spec-kit**, a UI framework for Pharo Smalltalk. It serves as:
- A template workspace for building Spec-kit applications
- An educational resource with examples and documentation
- A collection of reusable application patterns

**Technology Stack:**
- **Language**: Pharo Smalltalk (version 11+)
- **UI Framework**: Spec-kit (part of Pharo)
- **Package Management**: Metacello
- **Version Control**: Git

## Repository Structure

```
SpecKitLab/
├── .gitignore              # Git ignore rules for Pharo artifacts
├── README.md               # Main project documentation
├── CONTRIBUTING.md         # Contribution guidelines
├── CLAUDE.md              # This file - AI assistant guide
│
├── apps/                   # User-created applications directory
│   └── README.md          # Guide for creating applications
│
├── docs/                   # Comprehensive documentation
│   ├── GETTING_STARTED.md          # Beginner's guide to Spec-kit
│   └── APPLICATION_TEMPLATE.md     # Template for new apps
│
└── examples/               # Example applications
    ├── README.md
    └── HelloWorld/         # Complete working example
        ├── README.md
        ├── src/HelloWorld/
        │   ├── HelloWorldPresenter.class.st
        │   └── package.st
        └── baseline/BaselineOfHelloWorld/
            ├── BaselineOfHelloWorld.class.st
            └── package.st
```

## File Types and Conventions

### Smalltalk Class Files (`.class.st`)

These are Pharo class definition files in Tonel format:

**Structure:**
```smalltalk
Class {
    #name : #ClassName,
    #superclass : #SuperclassName,
    #instVars : [
        'instanceVariable1',
        'instanceVariable2'
    ],
    #category : #PackageName
}

{ #category : #initialization }
ClassName >> methodName [
    "Method implementation"
]
```

**Key Points:**
- Use tabs for indentation (not spaces)
- Method categories are declared with `{ #category : #categoryName }`
- Instance variables are symbols (prefixed with #)
- Method signatures use `>>` separator
- Self-referencing returns use `yourself`

### Package Metadata Files (`package.st`)

Simple one-line files defining package names:
```smalltalk
Package { #name : #PackageName }
```

### Baseline Files

Metacello configurations for dependency management:
```smalltalk
Class {
    #name : #BaselineOfAppName,
    #superclass : #BaselineOf,
    #category : #BaselineOfAppName
}

{ #category : #baselines }
BaselineOfAppName >> baseline: spec [
    <baseline>
    spec for: #common do: [
        spec package: 'AppName'
    ]
]
```

## Development Workflows

### Creating a New Application

**Step 1: Create Directory Structure**
```bash
mkdir -p apps/YourApp/src/YourApp
mkdir -p apps/YourApp/baseline/BaselineOfYourApp
```

**Step 2: Create Required Files**
- `apps/YourApp/README.md` - Application documentation
- `apps/YourApp/src/YourApp/YourAppPresenter.class.st` - Main presenter
- `apps/YourApp/src/YourApp/package.st` - Package metadata
- `apps/YourApp/baseline/BaselineOfYourApp/BaselineOfYourApp.class.st` - Baseline
- `apps/YourApp/baseline/BaselineOfYourApp/package.st` - Baseline package metadata

**Step 3: Implement Presenter**

Every Spec-kit presenter must:
- Inherit from `SpPresenter`
- Define instance variables for UI components
- Implement `initializePresenters` method
- Implement `defaultLayout` method
- Optionally implement `initializeWindow:` for window configuration
- Optionally implement `title` method

**Step 4: Document Your Application**

Include in README:
- Brief description
- Installation instructions (Metacello snippet)
- Usage examples
- Dependencies (if any)

### Working with Presenters

**Essential Methods:**

1. **initializePresenters** - Initialize UI components
   ```smalltalk
   initializePresenters [
       myButton := self newButton
           label: 'Click Me';
           action: [ self handleClick ];
           yourself.

       myLabel := self newLabel
           label: 'Initial text';
           yourself
   ]
   ```

2. **defaultLayout** - Define UI layout
   ```smalltalk
   defaultLayout [
       ^ SpBoxLayout newVertical
           spacing: 10;
           add: myLabel expand: false;
           add: myButton expand: false;
           yourself
   ]
   ```

3. **initializeWindow:** - Configure window properties
   ```smalltalk
   initializeWindow: aWindowPresenter [
       super initializeWindow: aWindowPresenter.
       aWindowPresenter
           title: self title;
           initialExtent: 400 @ 300
   ]
   ```

**Common UI Components:**
- `self newButton` - Button
- `self newLabel` - Label
- `self newTextInput` - Text input field
- `self newList` - List widget
- `self newCheckBox` - Checkbox
- `self newDropList` - Dropdown list

**Layout Types:**
- `SpBoxLayout newVertical` - Vertical box layout
- `SpBoxLayout newHorizontal` - Horizontal box layout
- Grid layouts and custom layouts available

## Coding Standards

### Naming Conventions

**Classes:**
- Use PascalCase: `MyAppPresenter`, `UserDataModel`
- Presenters should end with `Presenter`
- Models should end with `Model` (optional but recommended)
- Baselines: `BaselineOfAppName`

**Methods:**
- Use camelCase: `initializePresenters`, `handleButtonClick`
- Predicates should use `is` prefix: `isEmpty`, `isValid`
- Accessors are simple names: `title`, `data`

**Variables:**
- Use camelCase: `greetingLabel`, `userInput`
- Be descriptive but concise

**Categories (Method Protocols):**
- `#initialization` - Initialization methods
- `#accessing` - Getters and setters
- `#actions` - Event handlers
- `#layout` - Layout definitions
- `#api` - Public interface methods
- `#private` - Private methods
- `#examples` - Example methods (class side)

### Code Organization

**Separation of Concerns:**
- **Presenters**: Handle UI logic, layout, and user interactions
- **Models**: Handle business logic and data management
- Keep presenters focused on presentation, delegate logic to models

**File Organization:**
- One class per `.class.st` file
- File name matches class name: `HelloWorldPresenter.class.st`
- Group related classes in same package

### Comments and Documentation

**Method Comments:**
```smalltalk
methodName [
    "Brief description of what this method does.
    Can span multiple lines for complex methods."

    ^ self doSomething
]
```

**Class Comments:**
Add class-level documentation explaining purpose and usage.

## Testing Guidelines

**Current State:**
- No formal testing framework configured in repository
- Individual applications should include their own tests

**Recommended Practices:**
1. Write tests for models (business logic)
2. Write tests for presenters (UI behavior)
3. Use SUnit (Pharo's testing framework)
4. Test file naming: `MyAppPresenterTest.class.st`
5. Place tests in same package or separate test package

**Example Test Structure:**
```smalltalk
TestCase subclass: #MyAppPresenterTest
    instanceVariableNames: 'presenter'
    classVariableNames: ''
    package: 'MyApp-Tests'

testButtonAction [
    presenter := MyAppPresenter new.
    presenter openWithSpec.

    "Test button behavior"
    self assert: presenter myButton label equals: 'Click Me'
]
```

## Git Workflow

### Ignored Files

The `.gitignore` excludes:
- Pharo image files: `*.image`, `*.changes`
- Pharo system files: `pharo-local/`, `pharo-vm/`, `*.sources`
- Cache files: `cache/`, `*.log`, `*.fuel`, `package-cache/`, `github-cache/`
- IDE files: `.idea/`, `*.swp`, `.DS_Store`
- Build artifacts: `*.zip`, `*.tar.gz`

**Never commit:**
- Pharo image or changes files
- Cache directories
- Temporary or log files

### Commit Message Standards

Follow these conventions (from CONTRIBUTING.md):

**Format:**
- Start with a verb: Add, Update, Fix, Remove, Refactor
- Be specific about what changed
- Reference issues if applicable

**Examples:**
```
Add counter application example
Update getting started guide with new examples
Fix typo in application template
Remove deprecated presenter method
```

### Branch Strategy

- Work on feature branches when developing new applications
- Main branch should be stable
- Test in fresh Pharo image before committing

## Common Tasks for AI Assistants

### Task 1: Creating a New Application

**Checklist:**
1. ✅ Create directory structure in `apps/`
2. ✅ Create all required files (README, presenter, baseline, package.st files)
3. ✅ Implement presenter with proper methods
4. ✅ Use correct Smalltalk syntax and indentation (tabs)
5. ✅ Follow naming conventions
6. ✅ Document installation and usage
7. ✅ Verify file structure matches template

**Reference:** `docs/APPLICATION_TEMPLATE.md`

### Task 2: Creating an Example Application

Similar to Task 1, but place in `examples/` directory and:
- Focus on demonstrating specific Spec-kit features
- Include extensive code comments
- Provide clear learning objectives
- Keep it simple and easy to understand

### Task 3: Updating Documentation

When modifying documentation:
- Use clear, simple language
- Include working code examples
- Test all code snippets conceptually
- Use proper markdown formatting
- Add links to related resources

### Task 4: Reviewing Code

Check for:
- ✅ Proper class hierarchy (SpPresenter for UI classes)
- ✅ Required methods implemented (initializePresenters, defaultLayout)
- ✅ Correct use of `yourself` for chaining
- ✅ Proper indentation (tabs, not spaces)
- ✅ Method categories defined
- ✅ Naming conventions followed
- ✅ Package metadata files present

## Spec-kit Patterns and Best Practices

### Pattern 1: Opening Applications

**Simple open:**
```smalltalk
MyAppPresenter new open
```

**With window configuration:**
```smalltalk
MyAppPresenter new
    openWithSpec;
    withWindowDo: [ :w | w extent: 400@300 ]
```

**Modal dialog:**
```smalltalk
MyAppPresenter new openModal
```

**Class-side example method:**
```smalltalk
{ #category : #examples }
MyAppPresenter class >> example [
    <example>
    ^ self new open
]
```

### Pattern 2: Component Initialization

Always use `yourself` for method chaining:
```smalltalk
button := self newButton
    label: 'Click Me';
    action: [ self handleClick ];
    help: 'Click this button to perform action';
    yourself.
```

### Pattern 3: Layout Management

**Vertical layout with spacing:**
```smalltalk
defaultLayout [
    ^ SpBoxLayout newVertical
        spacing: 10;
        add: topComponent expand: false;
        add: middleComponent;
        add: bottomComponent expand: false;
        yourself
]
```

**Horizontal layout:**
```smalltalk
defaultLayout [
    ^ SpBoxLayout newHorizontal
        add: leftComponent;
        add: rightComponent;
        yourself
]
```

### Pattern 4: Event Handling

**Button actions:**
```smalltalk
button := self newButton
    label: 'Submit';
    action: [ self handleSubmit ];
    yourself.

handleSubmit [
    self inform: 'Form submitted!'
]
```

**Text input changes:**
```smalltalk
textInput := self newTextInput
    whenTextChangedDo: [ :newText | self handleTextChange: newText ];
    yourself.
```

### Pattern 5: Dialogs and User Feedback

**Info dialog:**
```smalltalk
self inform: 'Operation completed successfully'
```

**Confirm dialog:**
```smalltalk
(self confirm: 'Are you sure?')
    ifTrue: [ self performAction ]
```

**Request input:**
```smalltalk
result := UIManager default
    request: 'Enter your name:'
    initialAnswer: ''
```

## Loading and Running Applications

### Loading via Metacello

**From local repository:**
```smalltalk
Metacello new
    baseline: 'YourApp';
    repository: 'gitlocal://path/to/SpecKitLab/apps/YourApp';
    load.
```

**From GitHub:**
```smalltalk
Metacello new
    baseline: 'YourApp';
    repository: 'github://username/SpecKitLab:main/apps/YourApp';
    load.
```

### Running Examples

**HelloWorld example:**
```smalltalk
HelloWorldPresenter new open
```

Or use class-side example method:
```smalltalk
HelloWorldPresenter example
```

## Troubleshooting

### Common Issues

**Issue: Class not found after loading**
- Solution: Verify baseline configuration includes correct package name
- Check package.st files exist and have correct package names

**Issue: Layout doesn't display correctly**
- Solution: Verify `defaultLayout` method exists and returns proper SpBoxLayout
- Check all components are initialized in `initializePresenters`

**Issue: Methods not categorized**
- Solution: Add `{ #category : #categoryName }` before each method

**Issue: Window doesn't appear**
- Solution: Ensure you call `open` or `openWithSpec` on presenter instance

## Resources and References

**Official Documentation:**
- [Pharo.org](https://pharo.org/) - Main Pharo platform
- [Spec Documentation](https://github.com/pharo-spec/Spec) - Spec-kit framework
- [Pharo Books](https://books.pharo.org/) - Learning resources
- [Building UI with Spec](https://github.com/SquareBracketAssociates/BuildingUIWithSpec) - Tutorial

**Repository Documentation:**
- `README.md` - Project overview and quick start
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/GETTING_STARTED.md` - Comprehensive beginner's guide (205 lines)
- `docs/APPLICATION_TEMPLATE.md` - Application template guide (174 lines)
- `examples/HelloWorld/` - Working example application

## Key Reminders for AI Assistants

1. **File Format**: Use Tonel format for Smalltalk files, with tabs for indentation
2. **Always Include**: Both presenter and baseline files for any application
3. **Package Metadata**: Don't forget `package.st` files in both src and baseline directories
4. **Testing**: Encourage testing even though framework isn't set up
5. **Documentation**: Every application needs a README with installation instructions
6. **Naming**: Follow Pharo conventions strictly (PascalCase for classes, camelCase for methods)
7. **Separation**: Keep UI in presenters, business logic in models
8. **Layout**: Every presenter needs `defaultLayout` and `initializePresenters`
9. **Method Categories**: Always categorize methods appropriately
10. **Git Cleanliness**: Never commit Pharo image files or cache directories

## Quick Reference Card

| Task | Location | Key Files |
|------|----------|-----------|
| Create new app | `apps/YourApp/` | Presenter, Baseline, 2x package.st, README |
| Create example | `examples/YourApp/` | Same as above |
| Add documentation | `docs/` | Markdown files |
| View example code | `examples/HelloWorld/src/` | HelloWorldPresenter.class.st |
| Template reference | `docs/APPLICATION_TEMPLATE.md` | Complete template |
| Beginner guide | `docs/GETTING_STARTED.md` | Spec-kit introduction |
| Contribution rules | `CONTRIBUTING.md` | Guidelines and standards |

## Example: Minimal Working Application

This is the absolute minimum needed for a working Spec-kit application:

**Directory structure:**
```
apps/Minimal/
├── README.md
├── src/Minimal/
│   ├── MinimalPresenter.class.st
│   └── package.st
└── baseline/BaselineOfMinimal/
    ├── BaselineOfMinimal.class.st
    └── package.st
```

**MinimalPresenter.class.st:**
```smalltalk
Class {
	#name : #MinimalPresenter,
	#superclass : #SpPresenter,
	#instVars : [
		'label'
	],
	#category : #Minimal
}

{ #category : #layout }
MinimalPresenter >> defaultLayout [
	^ SpBoxLayout newVertical
		add: label;
		yourself
]

{ #category : #initialization }
MinimalPresenter >> initializePresenters [
	label := self newLabel
		label: 'Hello from Minimal App';
		yourself
]

{ #category : #accessing }
MinimalPresenter >> title [
	^ 'Minimal App'
]
```

**BaselineOfMinimal.class.st:**
```smalltalk
Class {
	#name : #BaselineOfMinimal,
	#superclass : #BaselineOf,
	#category : #BaselineOfMinimal
}

{ #category : #baselines }
BaselineOfMinimal >> baseline: spec [
	<baseline>
	spec for: #common do: [
		spec package: 'Minimal'
	]
]
```

**Both package.st files:**
```smalltalk
Package { #name : #Minimal }
```
```smalltalk
Package { #name : #BaselineOfMinimal }
```

**Run with:**
```smalltalk
MinimalPresenter new open
```

---

**Last Updated:** 2025-12-10
**Repository:** SpecKitLab
**For:** AI Assistants working with Pharo Smalltalk and Spec-kit applications
