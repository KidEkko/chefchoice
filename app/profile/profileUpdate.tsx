import { User } from "@/utils/types";
import "client-only"

import { useState } from "react";

export function ProfileUpdate({ initial }: { initial: User }) {
    const [form, setForm] = useState(initial); 

    return (<>
    </>)
}