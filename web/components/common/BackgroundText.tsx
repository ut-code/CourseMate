export default function BackgroundText({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center px-4 text-center">
      <p className="text-2xl text-gray-500">{text}</p>
    </div>
  );
}
