type Props<T> = {
  keyNameMap: Map<T, string>;
  selectedTag: T;
  onTagChange: (tag: T) => void;
};

export default function TagFilter<T extends string>({
  keyNameMap,
  selectedTag,
  onTagChange,
}: Props<T>) {
  const tags = Array.from(keyNameMap.keys());
  return (
    <div className="scrollbar-hide flex justify-start gap-1 overflow-x-auto whitespace-nowrap">
      {tags.map((tag) => (
        <div key={tag}>
          <input
            type="checkbox"
            id={tag}
            className="peer hidden"
            checked={selectedTag === tag}
            onChange={() => onTagChange(tag)}
          />
          <label
            htmlFor={tag}
            className="badge badge-lg cursor-pointer bg-gray-200 text-gray-800 transition-colors duration-200 peer-checked:bg-primary peer-checked:text-white"
          >
            {keyNameMap.get(tag)}
          </label>
        </div>
      ))}
    </div>
  );
}
