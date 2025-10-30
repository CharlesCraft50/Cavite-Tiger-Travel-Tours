export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-sm text-white text-center py-6 border-t mt-12">
      <div>
        2nd Floor WLM Bldg., Salawag, Dasmariñas, Cavite | Phone: 0956-375-9291 | Email: cavitetigers2021@gmail.com
      </div>
      <div className="mt-1">
        Copyright © {year} cavitetigertours
      </div>
    </footer>
  );
}
