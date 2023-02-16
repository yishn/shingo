import { Component } from "./component.ts";
import { Renderer, RendererScope, Rendering } from "./renderer.ts";

interface FragmentProps<R extends Renderer> {
  children?: Component<any, R> | Component<any, R>[];
}

export class Fragment<R extends Renderer> extends Component<
  FragmentProps<R>,
  R
> {
  render(_: RendererScope<R>): Component<any, R> {
    throw new Error("unimplemented");
  }

  createRendering(s: RendererScope<R>): Rendering<R> {
    const { children = [] } = this.props;

    return (
      [children].flat(1).map((component) => component.createRendering(s)) ?? []
    );
  }
}
