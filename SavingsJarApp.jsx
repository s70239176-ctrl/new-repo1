import { useState, useEffect, useRef, useCallback } from "react";

// ─── OpNet SDK imports (install: npm i opnet @btc-vision/transaction @btc-vision/bitcoin) ───
// import { getContract, JSONRpcProvider } from "opnet";
// import { Address, Wallet } from "@btc-vision/transaction";
// import { networks } from "@btc-vision/bitcoin";

// ─── Config ──────────────────────────────────────────────────────────────────
const CONFIG = {
  // Switch to "https://opnet.org" for mainnet
  rpcUrl: "https://testnet.opnet.org",
  // Your deployed SavingsJar contract address on OpNet testnet
  contractAddress: "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE",
  // Network: "testnet" | "mainnet" | "regtest"
  network: "testnet",
  decimals: 8,
  symbol: "TSAV",
  name: "TestSave",
  blocksPerMonth: 4320,
  yieldBps: 33, // 0.33% monthly = ~4% APY
};

// ─── ABI for SavingsJar custom methods ───────────────────────────────────────
const SAVINGS_JAR_ABI = [
  {
    name: "deposit",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "newBalance", type: "uint256" }],
  },
  {
    name: "withdraw",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [{ name: "newBalance", type: "uint256" }],
  },
  {
    name: "claimYield",
    inputs: [],
    outputs: [{ name: "yieldAmount", type: "uint256" }],
  },
  {
    name: "getDeposit",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "getPendingYield",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "pendingYield", type: "uint256" }],
  },
  {
    name: "getTotalDeposits",
    inputs: [],
    outputs: [{ name: "total", type: "uint256" }],
  },
  {
    name: "getTotalYieldPaid",
    inputs: [],
    outputs: [{ name: "total", type: "uint256" }],
  },
  // OP_20 standard methods
  {
    name: "balanceOf",
    inputs: [{ name: "address", type: "address" }],
    outputs: [{ name: "balance", type: "uint256" }],
  },
  {
    name: "approve",
    inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }],
    outputs: [{ name: "success", type: "bool" }],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const decimalsMultiplier = Math.pow(10, CONFIG.decimals);

function fromDecimals(raw) {
  return Number(raw) / decimalsMultiplier;
}

function toDecimals(human) {
  return BigInt(Math.round(human * decimalsMultiplier));
}

function fmt(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
}

function shortAddr(addr) {
  if (!addr) return "";
  return addr.slice(0, 8) + "..." + addr.slice(-6);
}

// ─── Coin visuals ─────────────────────────────────────────────────────────────
const COIN_COLORS = [
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
];

function generateCoins(fillPct) {
  const count = Math.floor(fillPct * 0.35);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 75,
    y: 2 + Math.random() * Math.min(fillPct * 0.85, 88),
    size: 28 + Math.random() * 20,
    delay: (i % 5) * 0.05,
    color: COIN_COLORS[i % COIN_COLORS.length],
  }));
}

function Coin({ x, y, size, delay, color }) {
  return (
    <div style={{
      position: "absolute", left: `${x}%`, bottom: `${y}%`,
      width: size, height: size * 0.35, borderRadius: "50%",
      background: color,
      boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)",
      animation: `coinFall 0.6s ${delay}s both`, opacity: 0,
    }} />
  );
}

// ─── OpNet wallet/contract hooks (stubbed — swap real SDK calls in) ───────────
function useOpNet() {
  const [wallet, setWallet] = useState(null);       // { address, publicKey }
  const [provider, setProvider] = useState(null);   // JSONRpcProvider
  const [contract, setContract] = useState(null);   // SavingsJar contract instance
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      // ── REAL IMPLEMENTATION ──────────────────────────────────────────────
      // const { JSONRpcProvider } = await import("opnet");
      // const { Address } = await import("@btc-vision/transaction");
      // const { networks } = await import("@btc-vision/bitcoin");
      //
      // // Connect to UniSat / OPNet wallet extension
      // if (!window.opnet) throw new Error("OpNet wallet not found. Install the OpNet extension.");
      // const accounts = await window.opnet.requestAccounts();
      // const pubkey   = await window.opnet.getPublicKey();
      //
      // const network  = networks.testnet; // or networks.bitcoin for mainnet
      // const rpc      = new JSONRpcProvider(CONFIG.rpcUrl, network);
      // const address  = new Address(Buffer.from(pubkey, "hex"));
      //
      // const { getContract } = await import("opnet");
      // const ctr = getContract(CONFIG.contractAddress, SAVINGS_JAR_ABI, rpc, network, address);
      //
      // setProvider(rpc);
      // setContract(ctr);
      // setWallet({ address: accounts[0], publicKey: pubkey });
      // ────────────────────────────────────────────────────────────────────

      // ── DEMO STUB (remove when using real SDK) ───────────────────────────
      await new Promise(r => setTimeout(r, 1200));
      setWallet({ address: "tb1qsavingsjar...testnet", publicKey: "03abc..." });
      setProvider({ rpcUrl: CONFIG.rpcUrl });
      setContract({ _demo: true });
      // ────────────────────────────────────────────────────────────────────

    } catch (e) {
      setError(e.message);
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet(null);
    setProvider(null);
    setContract(null);
  }, []);

  return { wallet, provider, contract, connecting, error, connect, disconnect };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SavingsJar() {
  const { wallet, contract, connecting, error: walletError, connect, disconnect } = useOpNet();

  // On-chain state
  const [depositedBalance, setDepositedBalance] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [pendingYield, setPendingYield] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalYieldPaid, setTotalYieldPaid] = useState(0);
  const [currentBlock, setCurrentBlock] = useState(0);

  // UI state
  const [depositInput, setDepositInput] = useState("");
  const [withdrawInput, setWithdrawInput] = useState("");
  const [txPending, setTxPending] = useState(false);
  const [txStatus, setTxStatus] = useState(null); // { type, msg }
  const [log, setLog] = useState([]);
  const [coins, setCoins] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [shake, setShake] = useState(false);

  const maxJarAmount = 1000;
  const fillPct = Math.min((depositedBalance / maxJarAmount) * 100, 100);

  useEffect(() => { setCoins(generateCoins(fillPct)); }, [Math.floor(fillPct)]);

  // Poll chain state when connected
  useEffect(() => {
    if (!wallet || !contract) return;
    fetchState();
    const id = setInterval(fetchState, 15000); // every 15s
    return () => clearInterval(id);
  }, [wallet, contract]);

  function addLog(msg, type = "info") {
    const time = new Date().toLocaleTimeString();
    setLog(prev => [{ msg, time, type, id: Date.now() + Math.random() }, ...prev].slice(0, 30));
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }

  // ── Fetch on-chain state ─────────────────────────────────────────────────
  async function fetchState() {
    if (!contract || !wallet) return;
    try {
      // ── REAL IMPLEMENTATION ──────────────────────────────────────────────
      // const [dep, bal, pending, totDep, totYield, block] = await Promise.all([
      //   contract.getDeposit(wallet.address),
      //   contract.balanceOf(wallet.address),
      //   contract.getPendingYield(wallet.address),
      //   contract.getTotalDeposits(),
      //   contract.getTotalYieldPaid(),
      //   provider.getBlockNumber(),
      // ]);
      // setDepositedBalance(fromDecimals(dep.properties.balance));
      // setWalletBalance(fromDecimals(bal.properties.balance));
      // setPendingYield(fromDecimals(pending.properties.pendingYield));
      // setTotalDeposits(fromDecimals(totDep.properties.total));
      // setTotalYieldPaid(fromDecimals(totYield.properties.total));
      // setCurrentBlock(block);
      // ────────────────────────────────────────────────────────────────────

      // ── DEMO STUB ────────────────────────────────────────────────────────
      // Simulated values for preview — remove when using real SDK
      setWalletBalance(prev => prev === 0 ? 1000 : prev);
      setCurrentBlock(prev => prev + 1);
      setPendingYield(prev => depositedBalance > 0 ? prev + depositedBalance * 0.0033 / 100 : 0);
      // ────────────────────────────────────────────────────────────────────
    } catch (e) {
      console.error("fetchState error:", e);
    }
  }

  // ── Deposit ──────────────────────────────────────────────────────────────
  async function deposit() {
    const amt = parseFloat(depositInput);
    if (!amt || amt <= 0 || amt > walletBalance) return;
    setTxPending(true);
    setTxStatus({ type: "pending", msg: "Approving + depositing on OpNet..." });
    try {
      // ── REAL IMPLEMENTATION ──────────────────────────────────────────────
      // const rawAmount = toDecimals(amt);
      //
      // // Step 1: approve the contract to burn your tokens
      // const approveTx = await contract.approve(CONFIG.contractAddress, rawAmount, {
      //   from: wallet.address,
      // });
      // await approveTx.wait();
      //
      // // Step 2: deposit
      // const depositTx = await contract.deposit(rawAmount, {
      //   from: wallet.address,
      // });
      // const receipt = await depositTx.wait();
      // const newBal = fromDecimals(receipt.results[0]);
      // ────────────────────────────────────────────────────────────────────

      // ── DEMO STUB ────────────────────────────────────────────────────────
      await new Promise(r => setTimeout(r, 1500));
      const newBal = depositedBalance + amt;
      setDepositedBalance(newBal);
      setWalletBalance(w => w - amt);
      setTotalDeposits(t => t + amt);
      // ────────────────────────────────────────────────────────────────────

      setTxStatus({ type: "success", msg: `Deposited ${fmt(amt)} ${CONFIG.symbol} ✓` });
      addLog(`💰 Deposited ${fmt(amt)} ${CONFIG.symbol}`, "success");
      setDepositInput("");
      setAnimating(true);
      setTimeout(() => setAnimating(false), 700);
      triggerShake();
    } catch (e) {
      setTxStatus({ type: "error", msg: `Deposit failed: ${e.message}` });
      addLog(`❌ Deposit failed: ${e.message}`, "error");
    } finally {
      setTxPending(false);
      setTimeout(() => setTxStatus(null), 4000);
    }
  }

  // ── Withdraw ─────────────────────────────────────────────────────────────
  async function withdraw() {
    const amt = parseFloat(withdrawInput);
    if (!amt || amt <= 0 || amt > depositedBalance) { triggerShake(); return; }
    setTxPending(true);
    setTxStatus({ type: "pending", msg: "Withdrawing from OpNet..." });
    try {
      // ── REAL IMPLEMENTATION ──────────────────────────────────────────────
      // const tx = await contract.withdraw(toDecimals(amt), { from: wallet.address });
      // await tx.wait();
      // ────────────────────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 1500));
      setDepositedBalance(d => d - amt);
      setWalletBalance(w => w + amt);
      setTotalDeposits(t => Math.max(0, t - amt));

      setTxStatus({ type: "success", msg: `Withdrew ${fmt(amt)} ${CONFIG.symbol} ✓` });
      addLog(`💸 Withdrew ${fmt(amt)} ${CONFIG.symbol}`, "success");
      setWithdrawInput("");
      triggerShake();
    } catch (e) {
      setTxStatus({ type: "error", msg: `Withdraw failed: ${e.message}` });
      addLog(`❌ Withdraw failed: ${e.message}`, "error");
    } finally {
      setTxPending(false);
      setTimeout(() => setTxStatus(null), 4000);
    }
  }

  // ── Claim Yield ───────────────────────────────────────────────────────────
  async function claimYield() {
    if (pendingYield <= 0) return;
    setTxPending(true);
    setTxStatus({ type: "pending", msg: "Claiming yield on OpNet..." });
    try {
      // ── REAL IMPLEMENTATION ──────────────────────────────────────────────
      // const tx = await contract.claimYield({ from: wallet.address });
      // const receipt = await tx.wait();
      // const yieldAmt = fromDecimals(receipt.results[0]);
      // ────────────────────────────────────────────────────────────────────

      await new Promise(r => setTimeout(r, 1500));
      const claimed = pendingYield;
      setWalletBalance(w => w + claimed);
      setTotalYieldPaid(y => y + claimed);
      setPendingYield(0);

      setTxStatus({ type: "success", msg: `Claimed ${fmt(claimed)} ${CONFIG.symbol} yield ✓` });
      addLog(`📈 Claimed ${fmt(claimed)} ${CONFIG.symbol} yield`, "success");
      triggerShake();
    } catch (e) {
      setTxStatus({ type: "error", msg: `Claim failed: ${e.message}` });
      addLog(`❌ Claim failed: ${e.message}`, "error");
    } finally {
      setTxPending(false);
      setTimeout(() => setTxStatus(null), 4000);
    }
  }

  const statusColor = txStatus?.type === "success" ? "#6dffb3"
    : txStatus?.type === "error" ? "#ff8080"
    : "#80d0ff";

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(ellipse at 20% 50%, #1a0a2e 0%, #0d0d1a 50%, #0a1a0d 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Georgia, serif", padding: "20px", boxSizing: "border-box",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500&display=swap');
        @keyframes coinFall {
          0%  { opacity:0; transform:translateY(-20px) scale(0.5); }
          60% { opacity:1; transform:translateY(4px) scale(1.1); }
          100%{ opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes coinDrop {
          0%  { transform:translateY(-60px) rotate(0deg); opacity:1; }
          100%{ transform:translateY(0) rotate(180deg); opacity:0; }
        }
        @keyframes shake {
          0%,100%{ transform:rotate(0deg); }
          20%    { transform:rotate(-2deg) translateX(-3px); }
          40%    { transform:rotate(2deg)  translateX(3px); }
          60%    { transform:rotate(-1.5deg) translateX(-2px); }
          80%    { transform:rotate(1.5deg) translateX(2px); }
        }
        @keyframes glimmer {
          0%,100%{ opacity:0.3; }
          50%    { opacity:0.7; }
        }
        @keyframes fadeSlide {
          from{ opacity:0; transform:translateY(-6px); }
          to  { opacity:1; transform:translateY(0); }
        }
        @keyframes pulse { 0%,100%{ transform:scale(1); } 50%{ transform:scale(1.02); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .sj-btn {
          border:none; cursor:pointer; transition:all 0.2s;
          font-family:'JetBrains Mono',monospace; font-size:11px;
          letter-spacing:1px; text-transform:uppercase;
          padding:10px 18px; border-radius:6px;
        }
        .sj-btn:hover:not(:disabled){ transform:translateY(-1px); filter:brightness(1.15); }
        .sj-btn:active:not(:disabled){ transform:translateY(0); }
        .sj-btn:disabled{ opacity:0.4; cursor:not-allowed; }
        .sj-input {
          background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
          color:#e8e0d0; padding:10px 14px; border-radius:6px;
          font-family:'JetBrains Mono',monospace; font-size:13px;
          width:110px; outline:none; transition:border-color 0.2s; box-sizing:border-box;
        }
        .sj-input:focus{ border-color:rgba(246,211,101,0.5); }
        .sj-log-entry{ animation:fadeSlide 0.3s ease; }
        .sj-scroll::-webkit-scrollbar{ width:4px; }
        .sj-scroll::-webkit-scrollbar-track{ background:transparent; }
        .sj-scroll::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.1); border-radius:2px; }
      `}</style>

      <div style={{ display:"flex", gap:"28px", alignItems:"flex-start", flexWrap:"wrap", justifyContent:"center", width:"100%" }}>

        {/* ── JAR ── */}
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"26px", fontWeight:900, color:"#f6d365", textShadow:"0 0 30px rgba(246,211,101,0.4)" }}>
              🫙 Savings Jar
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"rgba(200,180,150,0.5)", letterSpacing:"3px", textTransform:"uppercase", marginTop:"4px" }}>
              OP_20 · {CONFIG.symbol} · OpNet Testnet
            </div>
          </div>

          <div style={{ animation: shake ? "shake 0.6s ease" : "none" }}>
            <div style={{ width:"130px", height:"20px", background:"linear-gradient(180deg,#8b7355,#6b5a3e)", borderRadius:"8px 8px 2px 2px", margin:"0 auto", marginBottom:"-2px", position:"relative", zIndex:10, boxShadow:"0 2px 8px rgba(0,0,0,0.4)" }}>
              <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"70px", height:"5px", background:"rgba(255,255,255,0.1)", borderRadius:"3px" }} />
            </div>
            <div style={{ width:"170px", height:"220px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(200,230,255,0.08),rgba(255,255,255,0.03),rgba(200,230,255,0.06))", border:"2px solid rgba(200,220,255,0.15)", borderRadius:"8px 8px 24px 24px", zIndex:5, pointerEvents:"none" }}>
                <div style={{ position:"absolute", top:"10%", left:"8%", width:"10px", height:"60%", background:"linear-gradient(180deg,rgba(255,255,255,0.2),transparent)", borderRadius:"5px", animation:"glimmer 3s ease-in-out infinite" }} />
              </div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:`${fillPct}%`, background:"linear-gradient(180deg,rgba(246,211,101,0.15),rgba(246,211,101,0.35))", transition:"height 0.8s cubic-bezier(0.34,1.56,0.64,1)", borderRadius:"0 0 22px 22px" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background:"rgba(246,211,101,0.6)", filter:"blur(2px)" }} />
              </div>
              <div style={{ position:"absolute", inset:"10px", overflow:"hidden" }}>
                {coins.map(c => <Coin key={c.id} {...c} />)}
              </div>
              {animating && (
                <div style={{ position:"absolute", top:"20px", left:"50%", transform:"translateX(-50%)", width:"28px", height:"10px", borderRadius:"50%", background:"linear-gradient(135deg,#f6d365,#fda085)", animation:"coinDrop 0.7s ease-in forwards", zIndex:20 }} />
              )}
              {/* Not connected overlay */}
              {!wallet && (
                <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.65)", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:"8px 8px 24px 24px", zIndex:10 }}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"rgba(200,180,150,0.6)", textAlign:"center", letterSpacing:"1px" }}>
                    CONNECT<br/>WALLET
                  </div>
                </div>
              )}
            </div>
            <div style={{ width:"190px", height:"10px", background:"linear-gradient(180deg,#5a4a30,#3d3220)", borderRadius:"4px", margin:"0 auto", marginTop:"-2px", boxShadow:"0 4px 12px rgba(0,0,0,0.5)" }} />
          </div>

          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"rgba(246,211,101,0.7)", letterSpacing:"2px" }}>
            {fillPct.toFixed(1)}% FULL
          </div>

          {/* Block info */}
          {wallet && (
            <div style={{ textAlign:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", letterSpacing:"1px" }}>
              Block #{currentBlock.toLocaleString()}<br />
              ~{CONFIG.blocksPerMonth} blocks/month
            </div>
          )}
        </div>

        {/* ── CONTROLS ── */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px", width:"320px" }}>

          {/* Wallet connect */}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>
              OpNet Wallet
            </div>
            {!wallet ? (
              <button className="sj-btn" onClick={connect} disabled={connecting} style={{ width:"100%", background:"linear-gradient(135deg,#f6d365,#fda085)", color:"#1a0a2e", fontWeight:700 }}>
                {connecting ? (
                  <span style={{ display:"inline-flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ display:"inline-block", width:"10px", height:"10px", border:"2px solid #1a0a2e", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
                    Connecting...
                  </span>
                ) : "Connect Wallet"}
              </button>
            ) : (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#6dffb3" }}>● Connected</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"rgba(200,180,150,0.5)", marginTop:"2px" }}>{shortAddr(wallet.address)}</div>
                </div>
                <button className="sj-btn" onClick={disconnect} style={{ background:"rgba(255,100,100,0.1)", color:"#ff8080", border:"1px solid rgba(255,100,100,0.2)", padding:"6px 10px", fontSize:"10px" }}>
                  Disconnect
                </button>
              </div>
            )}
            {walletError && (
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"10px", color:"#ff8080", marginTop:"8px" }}>
                ⚠ {walletError}
              </div>
            )}
          </div>

          {/* Balance card */}
          <div style={{ background:"rgba(246,211,101,0.05)", border:"1px solid rgba(246,211,101,0.2)", borderRadius:"12px", padding:"18px", animation: shake ? "pulse 0.3s ease" : "none" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.5)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"6px" }}>Deposited Balance</div>
            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"30px", fontWeight:700, color:"#f6d365", lineHeight:1 }}>
              {fmt(depositedBalance)}
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"rgba(200,180,150,0.6)", marginTop:"3px" }}>{CONFIG.symbol}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginTop:"14px", paddingTop:"14px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              {[
                ["Wallet Balance", `${fmt(walletBalance)} ${CONFIG.symbol}`],
                ["Pending Yield", `${fmt(pendingYield)} ${CONFIG.symbol}`],
                ["Total Deposited", `${fmt(totalDeposits)} ${CONFIG.symbol}`],
                ["Total Yield Paid", `${fmt(totalYieldPaid)} ${CONFIG.symbol}`],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", letterSpacing:"1px", textTransform:"uppercase" }}>{label}</div>
                  <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#e8e0d0", marginTop:"2px" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contract info */}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>OP_20 Contract</div>
            {[
              ["Token", CONFIG.name],
              ["Symbol", CONFIG.symbol],
              ["Decimals", CONFIG.decimals],
              ["APY", "~4%"],
              ["Monthly Rate", `${CONFIG.yieldBps} bps`],
              ["Network", CONFIG.network],
            ].map(([k, v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"rgba(200,180,150,0.4)" }}>{k}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"#e8e0d0" }}>{v}</span>
              </div>
            ))}
            <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:"1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", marginBottom:"4px" }}>CONTRACT ADDRESS</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(246,211,101,0.5)", wordBreak:"break-all" }}>
                {CONFIG.contractAddress}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"14px" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"12px" }}>Actions</div>

            <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
              <input className="sj-input" type="number" placeholder="amount" value={depositInput} onChange={e => setDepositInput(e.target.value)} onKeyDown={e => e.key === "Enter" && deposit()} disabled={!wallet || txPending} />
              <button className="sj-btn" onClick={deposit} disabled={!wallet || txPending || !depositInput} style={{ background:"linear-gradient(135deg,#f6d365,#fda085)", color:"#1a0a2e", fontWeight:700, flex:1 }}>
                Deposit
              </button>
            </div>

            <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
              <input className="sj-input" type="number" placeholder="amount" value={withdrawInput} onChange={e => setWithdrawInput(e.target.value)} onKeyDown={e => e.key === "Enter" && withdraw()} disabled={!wallet || txPending} />
              <button className="sj-btn" onClick={withdraw} disabled={!wallet || txPending || !withdrawInput} style={{ background:"rgba(255,100,100,0.15)", color:"#ff8080", border:"1px solid rgba(255,100,100,0.2)", flex:1 }}>
                Withdraw
              </button>
            </div>

            <button className="sj-btn" onClick={claimYield} disabled={!wallet || txPending || pendingYield <= 0} style={{ width:"100%", background:"rgba(109,255,179,0.1)", color:"#6dffb3", border:"1px solid rgba(109,255,179,0.2)" }}>
              🌱 Claim Yield {pendingYield > 0 ? `(+${fmt(pendingYield)})` : ""}
            </button>
          </div>

          {/* Quick deposits */}
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
            {[1, 5, 10, 50, 100].map(amt => (
              <button key={amt} className="sj-btn" onClick={() => { setDepositInput(String(amt)); }} disabled={!wallet || txPending} style={{ background:"rgba(246,211,101,0.08)", color:"rgba(246,211,101,0.8)", border:"1px solid rgba(246,211,101,0.15)", padding:"6px 12px", fontSize:"11px" }}>
                +{amt}
              </button>
            ))}
          </div>

          {/* Tx status */}
          {txStatus && (
            <div style={{ background:"rgba(0,0,0,0.4)", border:`1px solid ${statusColor}33`, borderRadius:"8px", padding:"10px 14px", fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:statusColor, animation:"fadeSlide 0.3s ease" }}>
              {txPending && <span style={{ display:"inline-block", width:"8px", height:"8px", border:`2px solid ${statusColor}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite", marginRight:"8px" }} />}
              {txStatus.msg}
            </div>
          )}

          {/* Activity log */}
          <div className="sj-scroll" style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:"12px", padding:"14px", maxHeight:"150px", overflowY:"auto" }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.4)", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px" }}>Activity Log</div>
            {log.length === 0
              ? <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color:"rgba(200,180,150,0.3)", fontStyle:"italic" }}>
                  {wallet ? "Connect and deposit to start earning..." : "Waiting for wallet connection..."}
                </div>
              : log.map(entry => (
                <div key={entry.id} className="sj-log-entry" style={{ marginBottom:"5px" }}>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.3)", marginRight:"8px" }}>{entry.time}</span>
                  <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"11px", color: entry.type === "success" ? "#6dffb3" : entry.type === "error" ? "#ff8080" : "rgba(220,210,190,0.8)" }}>{entry.msg}</span>
                </div>
              ))
            }
          </div>

          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:"9px", color:"rgba(200,180,150,0.2)", textAlign:"center", letterSpacing:"1px", lineHeight:1.6 }}>
            Built on OpNet · Bitcoin L1 Smart Contracts<br />
            Yield accrues every ~{CONFIG.blocksPerMonth} blocks
          </div>
        </div>
      </div>
    </div>
  );
}
