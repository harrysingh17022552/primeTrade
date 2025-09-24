import { useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { IoMdAddCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [getNote, setGetNote] = useState(null);
  const errorRef = useRef(null);
  const updateRef = useRef(null);
  const addRef = useRef(null);
  const navigate = useNavigate();
  const [updateItem, setUpdateItem] = useState({ status: false, item: null });
  const [newNote, setNewNote] = useState({
    status: false,
    item: { title: "", body: "" },
  });

  const handleDelete = async (e, id) => {
    e.currentTarget.style.color = "green";
    e.currentTarget.classList.add("animate-pulse");
    const url = `${process.env.REACT_APP_BACKEND_HOST}/deleteNotes`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id: id }),
      credentials: "include",
    });
    if (response.ok) {
      setGetNote((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    if (response.status === 401) {
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
    e.currentTarget.style.color = "red";
    e.currentTarget.classList.remove("animate-pulse");
  };
  const handleUpdate = async (e) => {
    e.target.textContent = "Updating ...";
    const url = `${process.env.REACT_APP_BACKEND_HOST}/updateNotes`;
    const response = await fetch(url, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postDetails: {
          title: updateItem.item.title,
          body: updateItem.item.body,
        },
        id: updateItem.item.id,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      updateRef.current.style.color = "red";
      updateRef.current.textContent = data.message;
      e.target.textContent = "Update";
      if (response.status === 401) {
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
      return;
    }
    setGetNote((prev) =>
      prev.map((item) => {
        if (item.id === updateItem.item.id) {
          return {
            ...item,
            title: updateItem.item.title,
            body: updateItem.item.body,
          };
        }
        return item;
      })
    );
    updateRef.current.style.color = "green";
    updateRef.current.textContent = data.message;
    e.target.textContent = "Update";
    setTimeout(() => {
      setUpdateItem((props) => ({ ...props, status: false }));
    }, 1000);
  };
  const fetchNote = async () => {
    const url = `${process.env.REACT_APP_BACKEND_HOST}/getNotes`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
        errorRef.current.style.color = "red";
        errorRef.current.textContent = data.message;
        if (response.status === 401) {
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        }
        return;
      }
      setGetNote(data.notes);
      errorRef.current.style.color = "green";
      errorRef.current.textContent = data.message;
    } catch (error) {
      console.log(error);
      errorRef.current.style.color = "red";
      errorRef.current.textContent = error.message;
    }
    setTimeout(() => {
      errorRef.current.textContent = "";
    }, 2000);
  };
  const addNote = async (e) => {
    e.target.textContent = "Adding...";
    if (newNote.item.body.length > 2 && newNote.item.title.length > 2) {
      const url = `${process.env.REACT_APP_BACKEND_HOST}/postNotes`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postDetails: newNote.item }),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        addRef.current.style.color = "red";
        addRef.current.textContent = data.message;
      }
      setGetNote((prev) => [
        ...prev,
        {
          id:
            prev.length > 0 ? Math.max(...prev.map((item) => item.id)) + 1 : 1,
          created_at: "just now",
          title: newNote.item.title,
          body: newNote.item.body,
        },
      ]);
      addRef.current.style.color = "green";
      addRef.current.textContent = data.message;
      e.target.textContent = "Add";
      setTimeout(() => {
        setNewNote((props) => ({ ...props, status: false }));
      }, 2000);
    } else {
      addRef.current.style.color = "red";
      addRef.current.textContent = "Both fields are mandatory";
      e.target.textContent = "Add";
    }
  };
  useEffect(() => {
    fetchNote();
  }, []);
  return updateItem.status ? (
    <section className="w-screen h-screen flex justify-center items-center p-4">
      <article className="flex flex-col gap-4 w-full sm:w-[75%] lg:w-1/2">
        <span>
          <strong>Created at : </strong>
          {updateItem.item.created_at}
        </span>
        <div className="flex flex-col">
          <label htmlFor="title" className="ml-4 bg-white z-[1] w-fit">
            Title :
          </label>
          <input
            value={updateItem.item.title}
            type="text"
            name="title"
            id="title"
            className="p-2 rounded-md border-2 -mt-3 pt-4"
            onChange={(e) =>
              setUpdateItem((props) => ({
                ...props,
                item: { ...props.item, title: e.target.value },
              }))
            }
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="body" className="ml-4 bg-white z-[1] w-fit">
            Body :
          </label>
          <input
            value={updateItem.item.body}
            type="text"
            name="body"
            id="body"
            className="p-2 rounded-md border-2 -mt-3 pt-4"
            onChange={(e) =>
              setUpdateItem((props) => ({
                ...props,
                item: { ...props.item, body: e.target.value },
              }))
            }
          />
        </div>
        <button
          className="mt-4 px-8 py-2 bg-primary text-white font-bold rounded-md self-center flex gap-3"
          onClick={(e) => handleUpdate(e)}
        >
          Update
        </button>
        <p
          ref={updateRef}
          className="text-red-500 text-xl text-center font-bold"
        ></p>
        <ImCross
          className="absolute text-red-500 top-10 right-10 text-2xl cursor-pointer "
          onClick={() =>
            setUpdateItem((props) => ({ ...props, status: false }))
          }
        />
      </article>
    </section>
  ) : (
    <section className="flex flex-col items-center justify-center w-screen h-screen overflow-scroll gap-8 noscrollbar">
      {getNote ? (
        <article className="flex flex-col gap-8 p-2">
          {getNote.map((note, index) => (
            <article
              key={`note/${index}`}
              className="flex justify-between gap-4 border-2 rounded-md p-4"
            >
              <article className="flex flex-col gap-2 grow">
                <div className="flex justify-between gap-2">
                  <h1>{note.title}</h1>
                  <h1>{note.created_at}</h1>
                </div>
                <p>{note.body}</p>
              </article>
              <article className="flex flex-col justify-between items-center border-l-2">
                <MdDelete
                  title="remove"
                  className="text-red-500 text-2xl ml-2 cursor-pointer hover:scale-125"
                  onClick={(e) => handleDelete(e, note.id)}
                />
                <FaEdit
                  title="edit"
                  className="text-blue-500 text-2xl ml-2 cursor-pointer hover:scale-125"
                  onClick={() =>
                    setUpdateItem((props) => ({ item: note, status: true }))
                  }
                />
              </article>
            </article>
          ))}
        </article>
      ) : (
        <p
          className={`${
            errorRef ? "hidden" : "flex"
          } w-16 h-16 rounded-full border-4 border-l-violet-500 border-r-green-500 border-b-orange-600 border-t-red-500 animate-[spin_0.3s_linear_infinite]`}
        ></p>
      )}
      <IoMdAddCircle
        title="Add Note"
        className={`text-blue-400 ${
          newNote.status ? "hidden" : "flex"
        } text-6xl cursor-pointer transition-all hover:scale-125`}
        onClick={() => setNewNote((props) => ({ ...props, status: true }))}
      />
      {newNote.status && (
        <article className="relative flex flex-col gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="addtitle">Title</label>
            <input
              defaultValue={newNote.item.title}
              aria-required
              type="text"
              name="addtitle"
              id="addtitle"
              className="border-2 rounded-md p-2"
              onChange={(e) =>
                setNewNote((props) => ({
                  ...props,
                  item: { ...props.item, title: e.target.value },
                }))
              }
            />
          </div>
          <div className="flex flex-col w-full">
            <label htmlFor="addbody">Note</label>
            <textarea
              defaultValue={newNote.item.body}
              aria-required
              type="text"
              name="addbody"
              id="addbody"
              className="border-2 rounded-md p-2"
              onChange={(e) =>
                setNewNote((props) => ({
                  ...props,
                  item: { ...props.item, body: e.target.value },
                }))
              }
            />
          </div>
          <button
            className="bg-primary text-white font-bold rounded-md px-4 py-1 self-center"
            onClick={(e) => addNote(e)}
          >
            Add
          </button>
          <p
            ref={addRef}
            className="text-xl text-red-500 text-center font-bold"
          ></p>
          <ImCross
            className="text-red-500 text-xl absolute -top-4 -right-4 cursor-pointer"
            onClick={() => setNewNote((props) => ({ ...props, status: false }))}
          />
        </article>
      )}
      <p ref={errorRef} className="text-red-600 text-2xl font-bold">{getNote?.length===0 ? 'No Notes Found' : ''}</p>
    </section>
  );
}
