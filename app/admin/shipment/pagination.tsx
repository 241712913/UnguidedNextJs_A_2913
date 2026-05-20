type Props = {
  currentPage: number;
};

export default function Pagination({ currentPage }: Props) {
  return (
    <div className="flex gap-2 mt-4">
      <button className="px-3 py-1 border rounded">
        Prev
      </button>

      <span>Page {currentPage}</span>

      <button className="px-3 py-1 border rounded">
        Next
      </button>
    </div>
  );
}