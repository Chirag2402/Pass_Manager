import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passRef = useRef();
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [PasswordArray, setPasswordArray] = useState([]);

  const getPasswords = async () => {
    let req = await fetch("http://localhost:3000/");
    let passwords = await req.json();
    if (passwords) {
      setPasswordArray(passwords);
      console.log(passwords);
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to Clipboard", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigator.clipboard.writeText(text);
  };

  const SavePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {

      await fetch("http://localhost:3000/", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({id: form.id})});

      setPasswordArray([...PasswordArray, { ...form, id: uuidv4() }]);
      let res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...PasswordArray, { ...form, id: uuidv4() }]),
      });
      // localStorage.setItem("passwords", JSON.stringify([...PasswordArray, {...form, id:uuidv4()}]));
      setform({ site: "", username: "", password: "" });
    } else {
      toast("Please fill all the fields", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const HandleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const showPassword = () => {
    passRef.current.type = "text";
    if (ref.current.src.includes("/eyecross.svg")) {
      ref.current.src = "/eye.svg";
      passRef.current.type = "password";
    } else {
      ref.current.src = "/eyecross.svg";
      passRef.current.type = "text";
    }
  };

  const DeletePassword = async (id) => {
    setPasswordArray(PasswordArray.filter((item) => item.id !== id));
    let res = await fetch("http://localhost:3000/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({id})});
    // localStorage.setItem(
    //   "passwords",
    //   JSON.stringify(PasswordArray.filter((item) => item.id !== id))
    // );
  };

  const EditPassword = (id) => {
    setform({ ...PasswordArray.filter((i) => i.id === id)[0], id: id });
    setPasswordArray(PasswordArray.filter((item) => item.id !== id));
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="absolute top-0 -z-10 h-full w-full bg-green-50">
        <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[rgba(173,109,244,0.5)] opacity-50 blur-[80px]"></div>
      </div>
      <div className="mycontainer  w-4/6  ">
        <h1 className="text-4xl text font-bold text-center">
          <span className="text-green-500"> &lt;</span>
          <span>Pass</span>
          <span className="text-green-700">OP/&gt;</span>
        </h1>
        <p className="text-green-500 text-lg text-center">
          Your Own Password Manager
        </p>

        <div className="text-black flex flex-col  p-4 gap-4 ">
          <input
            value={form.site}
            onChange={HandleChange}
            name="site"
            className="rounded-full border border-green-500 w-full p-4 py-1"
            type="text"
            placeholder="Website URL"
          />
          <div className="flex flex-row justify-center gap-4  w-full">
            <input
              value={form.username}
              onChange={HandleChange}
              name="username"
              className="rounded-full border border-green-500  p-4 py-1 w-full "
              type="text"
              placeholder="Username"
            />
            <div className="relative ">
              <input
                ref={passRef}
                value={form.password}
                onChange={HandleChange}
                name="password"
                className="rounded-full border border-green-500  p-4 py-1 w-full "
                type="password"
                placeholder="Password"
              />
              <span
                className="absolute right-1 top-[5px]"
                onClick={showPassword}
              >
                <img ref={ref} src="/eye.svg" alt="img" />
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={SavePassword}
              className="flex justify-center items-center bg-green-500 rounded-full px-4 py-2 w-fit hover:bg-green-400 gap-2 "
            >
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
              Save
            </button>
          </div>
        </div>

        <div className="passwords mx-auto w-full ">
          <h1 className="text-2xl font-semibold py-4">Your Passwords</h1>
          {PasswordArray.length === 0 && (
            <p className="text-center text-2xl text-green-500">
              No Passwords Saved
            </p>
          )}
          {PasswordArray.length !== 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden">
              <thead className=" bg-green-800 text-white min-w-full">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Passwords</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-green-100 ">
                {PasswordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="px-2 py-2 text-center ">
                        <div className="flex justify-center items-center">
                          <a href={item.site} target="_blank">
                            {item.site}
                          </a>
                          <img
                            className="cursor-pointer"
                            onClick={() => {
                              copyText(item.site);
                            }}
                            src="copy.svg"
                            alt=""
                          />
                        </div>
                      </td>
                      <td className=" px-2 py-2 text-center ">
                        <div className="flex justify-center items-center">
                          {item.username}
                          <img
                            className="cursor-pointer"
                            onClick={() => {
                              copyText(item.username);
                            }}
                            src="copy.svg"
                            alt=""
                          />
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center ">
                        <div className="flex justify-center items-center">
                          {item.password}
                          <img
                            className="cursor-pointer"
                            onClick={() => {
                              copyText(item.password);
                            }}
                            src="copy.svg"
                            alt=""
                          />
                        </div>
                      </td>
                      <td className="px-1  text-center ">
                        <div className="flex justify-center gap-2">
                          {" "}
                          <button className="">
                            <span
                              onClick={() => {
                                DeletePassword(item.id);
                              }}
                            >
                              <lord-icon
                                src="https://cdn.lordicon.com/skkahier.json"
                                trigger="hover"
                                style={{ width: "30px", height: "30px" }}
                              ></lord-icon>
                            </span>
                          </button>
                          <button>
                            <img
                              onClick={() => {
                                EditPassword(item.id);
                              }}
                              className="w-[30px]"
                              src="edit.svg"
                              alt=""
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
