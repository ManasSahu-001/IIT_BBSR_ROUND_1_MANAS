import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import { api } from '../../utils/api.js';
import { soundFx } from '../../utils/sound.js';
import { Coins, Sparkles, Shield, Flame, Skull, Check, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TreasuryView() {
  const { progression, updateProgression } = useAuth();
  const { isUpsideDown, isHaunted, cardBg, btnPrimary, setTheme } = useTheme();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasingKey, setPurchasingKey] = useState(null);

  const fetchShop = async () => {
    try {
      const data = await api.get('/economy/shop');
      if (data.success) {
        setShopData(data);
      }
    } catch (err) {
      console.error('Failed to load shop:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handlePurchase = async (itemKey) => {
    setPurchasingKey(itemKey);
    soundFx.playClick();

    try {
      const data = await api.post('/economy/purchase', { itemKey });
      if (data.success) {
        soundFx.playLevelUp();
        confetti({ particleCount: 40, spread: 60 });
        updateProgression({ gold: data.newGold });
        fetchShop();
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setPurchasingKey(null);
    }
  };

  const handleEquip = async (itemKey) => {
    soundFx.playClick();
    try {
      const data = await api.post('/economy/equip', { itemKey });
      if (data.success) {
        if (data.themeId) {
          setTheme(data.themeId);
        }
        fetchShop();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono animate-pulse">
        Unlocking royal vaults and treasury exchange...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Treasury Header */}
      <div className={`rounded-2xl p-6 sm:p-8 border relative overflow-hidden ${cardBg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              METROPOLIS TREASURY & BAZAAR
            </span>
            <h2 className={`text-2xl sm:text-3xl font-black ${
              isUpsideDown ? 'stranger-title font-benguiat' : 'gothic-title font-gothic'
            }`}>
              City Vault & Emporium
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Spend quest rewards on dimensional themes, guild badges, and metropolitan artifacts.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-black/60 border border-yellow-500/30 px-5 py-3 rounded-2xl shadow-inner">
            <Coins className="w-7 h-7 text-yellow-400 animate-pulse" />
            <div>
              <span className="block text-[10px] uppercase font-mono text-slate-400 font-semibold">Available Gold</span>
              <span className="text-2xl font-black text-yellow-300 font-mono">{shopData.gold} G</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Items Catalog */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 font-mono">
          Featured Arcane & Dimensional Items
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {shopData.shop.map((item) => (
            <div key={item.key} className={`rounded-xl p-5 border flex flex-col justify-between ${cardBg}`}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {item.type}
                  </span>
                  <span className="text-xs font-bold text-yellow-400 font-mono flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5" /> {item.cost} G
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5">{item.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end">
                {item.isOwned ? (
                  item.isEquipped ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Equipped
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEquip(item.key)}
                      className="text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-lg transition-all"
                    >
                      Equip Item
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => handlePurchase(item.key)}
                    disabled={shopData.gold < item.cost || purchasingKey === item.key}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      shopData.gold >= item.cost ? btnPrimary : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{purchasingKey === item.key ? 'Claiming...' : 'Purchase'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
