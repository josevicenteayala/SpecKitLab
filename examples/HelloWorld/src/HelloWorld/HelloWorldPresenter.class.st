Class {
	#name : #HelloWorldPresenter,
	#superclass : #SpPresenter,
	#instVars : [
		'greetingLabel',
		'greetButton'
	],
	#category : #HelloWorld
}

{ #category : #examples }
HelloWorldPresenter class >> example [
	<example>
	^ self new open
]

{ #category : #layout }
HelloWorldPresenter >> defaultLayout [
	^ SpBoxLayout newVertical
		spacing: 10;
		add: greetingLabel expand: false;
		add: greetButton expand: false;
		yourself
]

{ #category : #initialization }
HelloWorldPresenter >> initializePresenters [
	greetingLabel := self newLabel
		label: 'Welcome to SpecKitLab!';
		yourself.
	
	greetButton := self newButton
		label: 'Say Hello';
		action: [ self showGreeting ];
		yourself
]

{ #category : #initialization }
HelloWorldPresenter >> initializeWindow: aWindowPresenter [
	super initializeWindow: aWindowPresenter.
	aWindowPresenter
		title: self title;
		initialExtent: 300 @ 150
]

{ #category : #actions }
HelloWorldPresenter >> showGreeting [
	greetingLabel label: 'Hello from Spec-kit!'.
	self inform: 'Hello World! This is a Spec-kit application.'
]

{ #category : #accessing }
HelloWorldPresenter >> title [
	^ 'Hello World - SpecKitLab'
]
