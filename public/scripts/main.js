const h = (tagName, attributes = {}, children = []) => {
  const node = document.createElement(tagName);

  for (let [name, value] of Object.entries(attributes)) {
    node.setAttribute(name, value);
  }

  if (children instanceof Array) {
    // When passing array as argument to function,
    // prefix it with `...` to pass all of the array's
    // values as arguments.
    node.append(...children);
    // node.append(children[0], children[1], children[2], ...);
  } else {
    node.append(children);
  }

  return node;
};

// example:
// h("p", { class: "my-class" });
// h("div", {}, h("span", {}, "Hi!"));
// h("div", {}, ["Hi!", h("em", {}, "Yo!")]);
