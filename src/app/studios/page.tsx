"use client";

import { useEffect, useState } from "react";

type Studio = {
  _id: string;
  name: string;
  category: string;
  location: string;
  hourlyRate: number;
  rating: number;
  imageUrl: string;
  description: string;
};

const StudiosPage = () => {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await fetch("http://localhost:8000/studios/featured");

        if (!res.ok) {
          throw new Error("Failed to fetch studios");
        }

        const data = await res.json();
        setStudios(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  if (loading) return <p>Loading studios...</p>;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Featured Studios</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {studios.map((studio) => (
          <div
            key={studio._id}
            className="overflow-hidden rounded-xl border"
          >
            <img
              src={studio.imageUrl}
              alt={studio.name}
              className="h-52 w-full object-cover"
            />

            <div className="space-y-2 p-4">
              <h2 className="text-xl font-semibold">{studio.name}</h2>

              <p>{studio.category}</p>
              <p>{studio.location}</p>
              <p>{studio.description}</p>

              <div className="flex justify-between">
                <span>৳{studio.hourlyRate}/hour</span>
                <span>⭐ {studio.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {studios.length === 0 && (
        <p className="py-10 text-center">No studios found.</p>
      )}
    </section>
  );
};

export default StudiosPage;