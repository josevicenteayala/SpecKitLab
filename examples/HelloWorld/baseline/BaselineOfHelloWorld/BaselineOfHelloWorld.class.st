Class {
	#name : #BaselineOfHelloWorld,
	#superclass : #BaselineOf,
	#category : #BaselineOfHelloWorld
}

{ #category : #baselines }
BaselineOfHelloWorld >> baseline: spec [
	<baseline>
	spec for: #common do: [
		spec package: 'HelloWorld'
	]
]
