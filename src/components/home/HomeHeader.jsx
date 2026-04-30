import React from "react";
import logo from "../../assets/Logo.png";

export default function HomeHeader({ userName = "Ghh" }) {
  return (
    <div style={styles.wrapper}>
      <div style={styles.left}>
        <img src={logo} alt="Tempo" style={styles.logo} />
        <div>
          <div style={styles.hello}>Bonjour,</div>
          <div style={styles.name}>{userName}</div>
        </div>
      </div>

      <div style={styles.avatar}>G</div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    objectFit: "contain",
    display: "block",
  },
  hello: {
    fontSize: 16,
    color: "#8D8A86",
    fontWeight: 700,
    lineHeight: 1.1,
  },
  name: {
    fontSize: 30,
    fontWeight: 900,
    color: "#1E1B18",
    lineHeight: 1.05,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    background: "linear-gradient(180deg, #FFF4EE 0%, #FBE3D8 100%)",
    border: "1px solid rgba(238, 126, 66, 0.18)",
    color: "#E8783F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 24,
    boxShadow: "0 10px 25px rgba(221, 119, 53, 0.08)",
  },
};
