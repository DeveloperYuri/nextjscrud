"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

interface Student {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState<Student>({
    name: "",
    email: "",
    phone_number: "",
    gender: "Male",
  });

  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Form Submit
  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(form);

    if (editId) {
      //update
      const { error } = await supabase
        .from("students")
        .update([form])
        .eq("id", editId);

      if (error) {
        toast.error("Failed to update student");
      } else {
        toast.success("Student update successfully");
        fetchStudents();
      }
    } else {
      //Add
      const { error } = await supabase.from("students").insert([form]);

      if (error) {
        toast.error(`Failed to create $(error.message)`);
      } else {
        toast.success("Student added successfully");
        fetchStudents();
      }

      setForm({
        name: "",
        email: "",
        phone_number: "",
        gender: "Male",
      });
    }
  }

  // Fetch Students Data
  async function fetchStudents() {
    const { data, error } = await supabase.from("students").select("*");

    if (error) {
      toast.error(`Failed to read data ${error.message}`);
    } else {
      console.log(data);
      setStudents(data || []);
    }
  }

  // Handle Student Edit
  function handleStudentEdit(student: Student) {
    setForm(student);
    if (student.id) {
      setEditId(student.id);
    }
  }

  // Handle Student Delete
  async function handleStudentDelete(id: string) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const { error } = await supabase
        .from("students")
        .delete()
        .eq("id", id);

      if (error) {
        console.error(error); // lihat detail error di console
        toast.error("Failed to delete student");
      } else {
        toast.success("Student delete successfully");
        fetchStudents();
      }
    }
  }

  return (
    <>
      <div className="container my-5">
        <Toaster />
        <h3 className="mb-4">Student Management</h3>
        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          name: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          email: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.phone_number}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          phone_number: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={form.gender}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          gender: event.target.value,
                        })
                      }
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button className="btn btn-primary w-100">
                    {editId ? "Update" : "Add"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side Table */}
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((singleStudent) => (
                    <tr key={singleStudent.id}>
                      <td>{singleStudent.name}</td>
                      <td>{singleStudent.email}</td>
                      <td>{singleStudent.phone_number}</td>
                      <td>{singleStudent.gender}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleStudentEdit(singleStudent)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() =>
                            singleStudent.id &&
                            handleStudentDelete(singleStudent.id)
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
