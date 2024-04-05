# 🚥 Shingō

A lightweight signal-based library for building web components with a React-like
API.

- 🌌 Web standards with custom HTML elements
- ⚛️ React-like API
- ✒️ Declarative templating with JSX (no additional parsing)
- 🚥 Fine-granular reactivity with signals
- 🛟 Type-safe components with TypeScript
- 🪶 Lightweight (~4KB minified and compressed)

```tsx
class Counter extends Component("x-counter") {
  render() {
    const [value, setValue] = useSignal(0);

    return (
      <>
        <p>Counter: {value}</p>
        <p>
          <button onclick={() => setValue((n) => n + 1)}>Increment</button>
          <button onclick={() => setValue((n) => n - 1)}>Decrement</button>
        </p>
      </>
    );
  }
}
```

## Guide

### Installation

Use npm to install Shingō:

```
npm install shingo
```

Shingō works out of the box with TypeScript. To use JSX, you can use the
following `tsconfig.json` options:

```json
{
  "compilerOptions": {
    "moduleResolution": "NodeNext",
    "jsx": "react-jsx",
    "jsxImportSource": "shingo"
    // …
  }
  // …
}
```

If you do not use TypeScript, you need to transform JSX, e.g. with Babel and
[@babel/plugin-transform-react-jsx](https:abeljs.io/docs/babel-plugin-transform-react-jsx):

```json
{
  "plugins": [
    [
      "@babel/plugin-transform-react-jsx",
      {
        "runtime": "automatic",
        "importSource": "shingo"
      }
    ]
    // …
  ]
  // …
}
```

Alternatively, you can also write templates using pure JavaScript. We will be
using TypeScript and JSX for the rest of the guide.

### Components

You can use `Component` to create a base class that can be extended into a web
component.

```tsx
import { Component, prop } from "shingo";

export class SimpleGreeting extends Component("simple-greeting", {
  name: prop<string>("John"),
}) {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`Greeting` is a custom HTML element and needs to be defined first before it can
be constructed. The tag name is given as first argument to `Component`.

```tsx
import { defineComponents } from "shingo";

// …

defineComponents(SimpleGreeting);
// In HTML: <simple-greeting></simple-greeting>
```

Optionally, you can provide a prefix:

```tsx
defineComponents("my-", SimpleGreeting);
// In HTML: <my-simple-greeting></my-simple-greeting>
```

By default, Shingō uses shadow DOM. You can disable this by setting the `shadow`
option on your component to `false`:

```tsx
export class SimpleGreeting extends Component(
  "simple-greeting",
  { name: prop<string>("John") },
  { shadow: false },
) {
  // …
}
```

### Properties

`Component` takes an object literal containing properties and events for the
component as second argument. Use the `prop` function to define properties and
optionally pass a default value:

```tsx
Component("simple-greeting", {
  name: prop<string>("John"),
});
```

Property names must not start with `on` as that prefix is reserved for events.
All properties can be accessed and set as actual class properties from the
outside:

```tsx
const el = new SimpleGreeting();
document.body.append(el);

console.log(el.name); // Prints "John"

el.name = "Jane"; // Component will now display "Hello, Jane!"
```

Note that none of the properties are required to be set when constructing the
component.

For reactivity in templates, you need signals instead. You can get the signals
of your properties in `this.props`:

```tsx
<h1>Hello, {this.props.name}!</h1>
```

It is generally discouraged to change properties from the inside of the
component as it breaks the unidirectional data flow. Instead, you should use
events to propagate changes upward.

You can associate attributes with props and by default all attribute changes
will be propagated to the properties. However, property changes will not be
propagated back to attributes. For string types, you can simply set the
`attribute` option to `true`:

```tsx
Component("simple-greeting", {
  name: prop<string>("John", {
    attribute: true,
  }),
});
```

By default the attribute name is the kebab-case version of the property name,
e.g. a property named `myName` will be assigned the attribute name `my-name`.
It's also possible to specify a custom attribute name:

```tsx
Component("simple-greeting", {
  name: prop<string>("John", {
    attribute: {
      name: "attr-name",
    },
  }),
});
```

For properties other than string types, you need to specify a transform function
that will convert strings into the property type, e.g.:

```tsx
Component("simple-greeting", {
  names: prop<string[]>(["John"], {
    attribute: (value) => value.split(","),
  }),
});

// or alternatively:

Component("simple-greeting", {
  names: prop<string[]>(["John"], {
    attribute: {
      name: "attr-name",
      transform: (value) => value.split(","),
    },
  }),
});
```

If an attribute is not specified on the element, the property will revert to the
default value.

### Events

You can define events on your component next to its properties by using the
`event` function. Note that event names must start with `on` and follows
camelCase convention:

```tsx
class TaskListItem extends Component("task-list-item", {
  text: prop<string>(""),
  completed: prop<boolean>(false),
  onCompletedChange: event<{ completed: boolean }>(),
}) {
  // …
}
```

Events can be listened to on the outside by using the `addEventListener` method:

```tsx
const el = new TaskListItem();
document.body.append(el);

el.addEventListener("completed-change", (evt) => {
  // evt is CustomEvent<{ completed: boolean }>
  console.log(evt.detail.completed);
});
```

Note that the native event name is the kebab-case version without the `on`
prefix of the name defined in the component, e.g. `onCompletedChange` will be
assigned to `completed-change`.

To emit an event from the inside of the component, you can call the
corresponding method in `this.events`:

```tsx
class TaskListItem extends Component("task-list-item", {
  // …
  onCompletedChange: event<{ completed: boolean }>(),
}) {
  render() {
    return (
      <>
        <input
          type="checkbox"
          checked={this.props.completed}
          onchange={(evt) => {
            this.events.onCompletedChange({
              details: {
                completed: !evt.currentTarget.checked,
              },
            });
          }}
        />
        {/* … */}
      </>
    );
  }
}
```

By default a `CustomEvent` will be dispatched. You can also specify a different
event constructor, either your own or another native event constructor. Shingō
expects the first constructor argument to be the event name and the second
argument to be the event details that is passed to the event emitter:

```tsx
class CompletedChangeEvent extends Event {
  constructor(
    name: string,
    public completed: boolean,
  ) {
    super(name);
  }
}

class TaskListItem extends Component("task-list-item", {
  // …
  onCompletedChange: event(CompletedChangeEvent),
}) {
  render() {
    return (
      <>
        <input
          type="checkbox"
          checked={this.props.completed}
          onchange={(evt) => {
            this.events.onCompletedChange(!evt.currentTarget.checked);
          }}
        />
        {/* … */}
      </>
    );
  }
}
```

The emitter function `this.events.onCompletedChange` will return `false` if the
event is cancelable and at least one of the event listeners called
`evt.preventDefault()`, otherwise `true`.

### Templates

### Reactivity
