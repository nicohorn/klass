import React, { useState } from "react";
import FaqComponent from "./components/Faq";

export default function Faq() {
  const content = [
    {
      q: "Lorem ipsum dolor sit amet",
      a: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat ",
      a: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
      a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur",
    },
    {
      q: "At vero eos et accusamus et iusto",
      a: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    },
    {
      q: "Phasellus eu orci ut metus vulputate condimentum. Integer nisi neque, euismod ac auctor vitae, feugiat et erat.",
      a: "In hendrerit arcu eget elit laoreet viverra. Phasellus placerat ac arcu sit amet gravida. Sed vehicula ullamcorper lobortis. Etiam ullamcorper metus blandit magna sollicitudin fermentum vel vel ligula. Nullam porttitor nulla dictum ornare molestie. Duis accumsan elit sed urna viverra, ut iaculis mauris feugiat. Nulla et eleifend ligula. In sit amet luctus massa, in blandit erat. Suspendisse est nisi, tempor et consectetur vitae, condimentum ac sapien. Curabitur at dui elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin lorem ipsum, porttitor interdum ipsum gravida eu. Suspendisse quis odio ut dui ullamcorper egestas in nec nisi.",
    },

    {
      q: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat ",
      a: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem",
      a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur",
    },
    {
      q: "At vero eos et accusamus et iusto",
      a: "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
    },
    {
      q: "Phasellus eu orci ut metus vulputate condimentum. Integer nisi neque, euismod ac auctor vitae, feugiat et erat.",
      a: "In hendrerit arcu eget elit laoreet viverra. Phasellus placerat ac arcu sit amet gravida. Sed vehicula ullamcorper lobortis. Etiam ullamcorper metus blandit magna sollicitudin fermentum vel vel ligula. Nullam porttitor nulla dictum ornare molestie. Duis accumsan elit sed urna viverra, ut iaculis mauris feugiat. Nulla et eleifend ligula. In sit amet luctus massa, in blandit erat. Suspendisse est nisi, tempor et consectetur vitae, condimentum ac sapien. Curabitur at dui elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin lorem ipsum, porttitor interdum ipsum gravida eu. Suspendisse quis odio ut dui ullamcorper egestas in nec nisi.",
    },
  ];
  const [show, setShow] = useState(false);

  return (
    <div className="transition-all duration-200">
      <div className="flex flex-col w-[1280px] mx-auto px-20 py-10 justify-center">
        <div className="my-2">
          <span
            className={
              show
                ? " p-2 text-sm text-white bg-black"
                : "hover:scale:105 text-sm hover:bg-black border p-2 transition-all duration-300 hover:text-white"
            }
          >
            <button onClick={() => setShow(!show)}>Expandir todos</button>
          </span>
        </div>
        {content.map((item, i) => (
          <div key={i} className="mt-5">
            <FaqComponent
              s={show ? true : false}
              q={item.q}
              a={item.a}
            ></FaqComponent>
          </div>
        ))}
      </div>
    </div>
  );
}
