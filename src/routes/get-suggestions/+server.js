import { json } from "@sveltejs/kit";

export async function GET() {
    return json([
        {
            "id": "id1",
            "label": "Labelaaa 1"
        },
        {
            "id": "id2",
            "label": "Labelaba 2"
        },
        {
            "id": "id3",
            "label": "Labelbb 3"
        },
        {
            "id": "id4",
            "label": "Labelccc 4"
        },
        {
            "id": "id5",
            "label": "Labeldd 5"
        }
    ]);
}
