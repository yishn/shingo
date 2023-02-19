import {
  Component,
  RendererScope,
  Rendering,
  Fragment,
} from "../renderer/mod.ts";
import type { SignalLike } from "../scope.ts";
import { HtmlNodeType, DomRenderer } from "./mod.ts";
import { setAttr, setStyle } from "./dom.ts";

export type TagProps<T extends string> = {
  tagName: T;
} & JSX.IntrinsicElements[T];

export class TagComponent<T extends string> extends Component<
  TagProps<T>,
  DomRenderer
> {
  render(_: RendererScope<DomRenderer>): Component<any, DomRenderer> {
    throw new Error("unimplemented");
  }

  reify(s: RendererScope<DomRenderer>): Rendering<DomRenderer> {
    const { tagName, ref, style, children, dangerouslySetInnerHTML, ...attrs } =
      this.props;
    const prevIsSvg = s.renderer.isSvg;

    if (tagName === "svg") {
      s.renderer.isSvg = true;
    }

    const node = s.renderer.createNode([HtmlNodeType.Element, tagName]) as
      | HTMLElement
      | SVGElement;

    if (ref != null) {
      s.renderer.linkNodeRef(node, ref);
    }

    for (const [name, value] of Object.entries(style ?? {})) {
      s.effect(() => {
        setStyle(node, name, typeof value === "function" ? value() : value);
      });
    }

    for (const [name, value] of Object.entries(attrs)) {
      if (name.startsWith("on") && name.length > 2) {
        // Register event

        node.addEventListener(name.slice(2), (evt) =>
          s.batch(() => value(evt))
        );
      } else {
        // Set attribute

        s.effect(() => {
          setAttr(node, name, typeof value === "function" ? value() : value);
        });
      }
    }

    if (dangerouslySetInnerHTML != null) {
      s.effect(() => {
        const html = dangerouslySetInnerHTML!().__html;

        if (node.innerHTML !== html) {
          node.innerHTML = html;
        }
      });
    } else {
      s.renderer.appendRendering(
        node,
        new Fragment({
          children: [children].flat(1).map((child) => {
            if (child instanceof Component) {
              return child;
            } else {
              return new Text({ children: child });
            }
          }),
        }).reify(s)
      );
    }

    s.renderer.isSvg = prevIsSvg;

    return [node];
  }
}

interface TextProps {
  children?: string | number | SignalLike<string | number>;
}

export class Text extends Component<TextProps, DomRenderer> {
  render(_: RendererScope<DomRenderer>): Component<any, DomRenderer> {
    throw new Error("unimplemented");
  }

  reify(s: RendererScope<DomRenderer>): Rendering<DomRenderer> {
    const node = s.renderer.createNode([HtmlNodeType.Text, ""]);

    s.effect(() => {
      const text =
        typeof this.props.children === "function"
          ? this.props.children().toString()
          : this.props.children?.toString() ?? "";

      if (node.textContent !== text) {
        node.textContent = text;
      }
    });

    return [node];
  }
}