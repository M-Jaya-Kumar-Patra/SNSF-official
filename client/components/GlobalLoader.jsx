'use client';

import { useAuth } from "@/app/context/AuthContext";
import Loading from "../app/Loading";

export default function GlobalLoader() {
  const { loading } = useAuth();

  return loading ? <Loading /> : null;
}
    