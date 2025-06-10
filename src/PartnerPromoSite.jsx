import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import cbnuLogo from "../public/logos/ece.png";

function Button({ children, onClick, variant = "default" }) {
  const base = "px-5 py-2 rounded-full font-medium transition text-sm";
  const styles = variant === "default"
    ? "bg-[#0d5bc6] text-white hover:bg-[#0a4ab0]"
    : "border border-[#0d5bc6] text-[#0d5bc6] hover:bg-blue-50";
  return <button onClick={onClick} className={`${base} ${styles}`}>{children}</button>;
}

function Dialog({ children }) {
  return <>{children}</>;
}

function DialogContent({ children }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full">
        {children}
      </div>
    </div>
  );
}

function DialogTitle({ children }) {
  return <h2 className="text-2xl font-semibold text-[#0d5bc6] mb-3">{children}</h2>;
}

export default function PartnerPromoSite() {
  const [places, setPlaces] = useState([]);
  const [openDialogIdx, setOpenDialogIdx] = useState(null);
  const [gateFilter, setGateFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(async () => {
        const res = await fetch("http://localhost:5050/places");
        const data = await res.json();
        console.log("받은 데이터:", data); // 👉 이 줄 꼭 추가
        setPlaces(data);

        const mapContainer = document.getElementById("map");
        const mapInstance = new window.kakao.maps.Map(mapContainer, {
          center: new window.kakao.maps.LatLng(36.626, 127.462),
          level: 3,
        });

        setMap(mapInstance);
      });
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!map || places.length === 0) return;

    markers.forEach((m) => m.setMap(null));
    const newMarkers = [];

    const filtered = places.filter((p) => {
      const matchGate = gateFilter === "전체" || p.gate === gateFilter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchGate && matchSearch;
    });

    filtered.forEach((p) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(p.lat, p.lng),
        map
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style=\"padding:5px;font-size:12px;\">${p.name}</div>`
      });

      window.kakao.maps.event.addListener(marker, "mouseover", () => infowindow.open(map, marker));
      window.kakao.maps.event.addListener(marker, "mouseout", () => infowindow.close());
      window.kakao.maps.event.addListener(marker, "click", () => setOpenDialogIdx(places.indexOf(p)));

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    if (filtered.length > 0) {
      const first = filtered[0];
      map.panTo(new window.kakao.maps.LatLng(first.lat, first.lng));
    } else {
      map.panTo(new window.kakao.maps.LatLng(36.626, 127.462));
      map.setLevel(3);
    }
  }, [gateFilter, search, map, places]);

  const gates = ["전체", "중문", "서문", "후문"];

  const filtered = places.filter((p) => {
    const matchGate = gateFilter === "전체" || p.gate === gateFilter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchGate && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="font-sans bg-white">
      <header className="bg-gradient-to-r from-[#041e49] via-[#053071] to-[#0d5bc6] text-white shadow-md sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={cbnuLogo} alt="충북대 로고" className="w-8 h-8" />
            <h1 className="text-2xl font-bold whitespace-nowrap">전자정보대학 제휴업체 도우미</h1>
          </div>
          <div className="flex items-center gap-6 font-bold text-base">
            {gates.map((gate) => (
              <button
                key={gate}
                onClick={() => { setGateFilter(gate); setCurrentPage(1); }}
                className={`transition ${gateFilter === gate ? "text-yellow-300" : "hover:text-blue-200"}`}
              >
                {gate}
              </button>
            ))}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-gray-300"
              aria-label="검색 열기"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${searchOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-screen-xl mx-auto px-6 pb-4">
            <input
              type="text"
              autoFocus
              placeholder="업체명 검색"
              className="w-full px-4 py-3 text-lg text-white bg-transparent border-b border-gray-300 placeholder-gray-300 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="h-1 mt-2 w-full bg-gradient-to-r from-[#041e49] via-[#053071] to-[#0d5bc6] rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="py-12 min-h-screen">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-[#0d5bc6] mb-6">제휴업체 위치 및 정보</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="lg:w-1/2 space-y-8">
              <div className="space-y-4">
                {currentData.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    해당 조건에 맞는 제휴 업체가 없습니다.
                  </div>
                ) : (
                  currentData.map((partner, idx) => (
                    <div key={idx}>
                      <div onClick={() => setOpenDialogIdx(places.indexOf(partner))} className="bg-white p-5 rounded-2xl shadow hover:shadow-lg cursor-pointer transition duration-300">
                        <h2 className="text-lg font-semibold text-[#0d5bc6]">{partner.name}</h2>
                        <p className="text-sm text-gray-600 mt-2">{partner.benefit ? `${partner.benefit.slice(0, 40)}...` : "혜택 정보 없음"}</p>
                      </div>
                      {openDialogIdx === places.indexOf(partner) && (
                        <Dialog>
                          <DialogContent>
                            <DialogTitle>{partner.name}</DialogTitle>
                            <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{partner.benefit || "혜택 정보 없음"}</p>
                            <div className="mt-4 text-right">
                              <Button onClick={() => setOpenDialogIdx(null)} variant="outline">닫기</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i} onClick={() => setCurrentPage(i + 1)} variant={currentPage === i + 1 ? "default" : "outline"}>{i + 1}</Button>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div id="map" className="w-full h-[600px] rounded-2xl overflow-hidden shadow bg-white"></div>
            </div>
          </div>
        </div>
      </main>

      <footer id="contact" className="bg-[#041e49] text-white py-6 mt-20">
        <div className="max-w-screen-xl mx-auto px-6 text-center text-xs text-gray-300">
          © 평가절하팀 문의: woalsrhkr@gmail.com
        </div>
      </footer>
    </div>
  );
}
