"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useProfileStore } from "./store";
import { useRouter } from "next/navigation";
export default function ProfilePage() {
  const [step, setStep] = useState(1);

  function next() {
    setStep((s) => s + 1);
  }

  function prev() {
    setStep((s) => s - 1);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Complete Your Profile
        </h1>

        {step === 1 && <Step1 next={next} />}
        {step === 2 && <Step2 next={next} prev={prev} />}
        {step === 3 && <Step3 next={next} prev={prev} />}
        {step === 4 && <Step4 prev={prev} />}

        <div className="mt-6 text-center text-sm text-gray-600">
          Step {step} of 4
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   STEP 1 — Personal Details
--------------------------------------------------- */

function Step1({ next }: any) {
  const { data, update } = useProfileStore();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      age: data.age || "",
      gender: data.gender || "",
    },
  });

  function onSubmit(values: any) {
    update({
      age: Number(values.age),
      gender: values.gender,
    });
    next();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

      <div className="space-y-3">
        <input
          {...register("age")}
          type="number"
          placeholder="Age"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          {...register("gender")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>

      <Button className="mt-4 w-full" type="submit">
        Next
      </Button>
    </form>
  );
}

/* ---------------------------------------------------
   STEP 2 — Location Details
--------------------------------------------------- */

function Step2({ next, prev }: any) {
  const { data, update } = useProfileStore();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      state: data.state,
      district: data.district,
    },
  });

  function onSubmit(values: any) {
    update(values);
    next();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold mb-4">Location Details</h2>

      <div className="space-y-3">
        <input
          {...register("state")}
          placeholder="State"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          {...register("district")}
          placeholder="District"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" type="button" onClick={prev}>
          Back
        </Button>

        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------
   STEP 3 — Income + Category
--------------------------------------------------- */

function Step3({ next, prev }: any) {
  const { data, update } = useProfileStore();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      income: data.income || "",
      category: data.category || "",
    },
  });

  function onSubmit(values: any) {
    update({
      income: Number(values.income),
      category: values.category,
    });
    next();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold mb-4">Economic & Category Details</h2>

      <div className="space-y-3">
        <input
          {...register("income")}
          type="number"
          placeholder="Annual Income"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          {...register("category")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Category</option>
          <option>General</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        <Button variant="outline" type="button" onClick={prev}>
          Back
        </Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------
   STEP 4 — Occupation + Disability
--------------------------------------------------- */

function Step4({ prev }: any) {
  const { data, update } = useProfileStore();
  const router = useRouter();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      occupation: data.occupation,
      disability: data.disability === true ? "yes" : "no",
    },
  });

  async function onSubmit(values: any) {
    const finalData = {
      ...data,
      occupation: values.occupation,
      disability: values.disability === "yes",
    };

    update(finalData);

    const res = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    });

    if (res.ok) {
      // You can show a toast later; for now redirect
      router.push("/dashboard");
    } else {
      alert("Error saving profile");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-semibold mb-4">Occupation Details</h2>

      <div className="space-y-3">
        <input
          {...register("occupation")}
          placeholder="Occupation"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          {...register("disability")}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="no">Disability?</option>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          type="button"
          onClick={prev}
        >
          Back
        </Button>
        <Button type="submit">Finish</Button>
      </div>
    </form>
  );
}