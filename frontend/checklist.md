# Checklist
- [ ] [Layers](#1-layers)
  - [ ] [Page components](#11-page-components)
  - [ ] [Presentational components](#12-presentational-components)
  - [ ] [Business logic](#13-business-logic)


## 1) Layers

### 1.1 Page components
The top-level component of a route is a Page Component.
Only Page components may work with Business logic, State managment layers, Data layer. Page components contain child Presentational components
<!-- #### Problem
#### Solution -->

### 1.2 Presentational components
Presentational components are the leafs in the component tree
They communicate with the parent components via @Input and @Output decorators. They get data from parent via @Input and emit data to parent via @Output only. Exclusion, for deeply nested components are allowed to use State managment layers and Data layer services for subscribing and dispathing event, but changing Data Layer is stricted, like different kind of Storages.

Presentational components can be Stateless, meaning their appearance and behaviour are always the same. Stateless presentational components are entirely about what is presented to the user.

Presentational components can be Statefull, meaning they have their own isolated state. Think about a checkbox component. It has at least two states: Checked and cleared. The checkbox status is a piece of local UI state.

A directive is a part of Presentation layer.

Decoupling presentational logic from the core have several benefits, such as: 
1) Presentational components are usually reusable. Their data binding API or rendering API allow them to be used in many places.
2) Presentational components are pure in the sense that they are free from side effects. Integration with state management, persistence and other non-presentational layers belong in Page components.
3) After splitting mixed components into Page components and presentational components we can apply the OnPush change detection strategy to optimise dirty checking and rendering as seen
4) If an event binding in this component's template is triggered or an AsyncPipe in a descendant Page component receives a new value, this component and all of its ancestors in the component tree is marked as dirty and will be fully dirty checked in the next change detection cycle.
5) UI components stay lightweight because dependencies like async or state management services are not injected into the UI components.
6) UI components and the entire application become better testable. We can more easier mock the application’s parts.
<!-- #### Problem
#### Solution -->

### 1.3 Business logic
<!-- #### Problem
#### Solution -->


