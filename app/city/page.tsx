
import City from "./city";

export default function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  return <City city={searchParams.city || ""} />;
}
