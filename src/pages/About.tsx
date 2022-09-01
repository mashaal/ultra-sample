import { trpc } from "../trpc/client.ts";
import { tw } from "twind";

export default function AboutPage() {
    const { data } = trpc.hello.useQuery();
    return (
      <div className={tw`text(3xl white) bg-blue-500 p-3`}>
        About page
      </div>
    );
  }