interface RoundButtonProps {
  onclick: () => void;
  icon: React.ReactNode;
}

export default function RoundButton({ onclick, icon }: RoundButtonProps) {
  return (
    <button
      type="button"
      onClick={onclick}
      className="btn btn-circle bg-white shadow-md"
    >
      {icon}
    </button>
  );
}
