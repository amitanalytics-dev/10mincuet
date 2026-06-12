export type Formula = {
  name: string;
  formula: string;
  note: string;
};

export type Example = {
  problem: string;
  solution: string;
  keyStep: string;
};

export type QuickFire = {
  q: string;
  a: string;
};

export type Snippet = {
  formulas: Formula[];
  examples: Example[];
  quickFire: QuickFire[];
};

export const snippetBank: Record<string, Snippet> = {
  "electrostatics-and-capacitors": {
    formulas: [
      { name: "Coulomb's Law", formula: "F = kQ₁Q₂/r²", note: "k = 9×10⁹ N·m²/C². Force is along the line joining charges. Repulsive if same sign, attractive if opposite." },
      { name: "Electric Field (point charge)", formula: "E = kQ/r²", note: "Direction away from +Q, toward −Q. Use superposition for multiple charges: add vectors." },
      { name: "Gauss's Law", formula: "∮E·dA = Q_enc/ε₀", note: "Pick Gaussian surface with symmetry: sphere for point/spherical, cylinder for line charge, plane for infinite sheet." },
      { name: "Capacitance with Dielectric", formula: "C = κε₀A/d", note: "κ = dielectric constant. For series: 1/C_eq = Σ1/Cᵢ. For parallel: C_eq = ΣCᵢ." },
      { name: "Energy Stored", formula: "U = ½CV² = Q²/2C", note: "All three forms are equivalent. Use whichever two quantities are given. Energy stored in electric field = ε₀E²/2 per unit volume." },
    ],
    examples: [
      {
        problem: "Three capacitors C₁=2μF, C₂=3μF, C₃=6μF are connected in series. Find equivalent capacitance and energy stored if V=12V.",
        solution: "1/C_eq = 1/2 + 1/3 + 1/6 = 3/6 + 2/6 + 1/6 = 6/6 = 1 → C_eq = 1 μF. Q = C_eq × V = 1×10⁻⁶ × 12 = 12 μC. U = ½C_eq V² = ½×10⁻⁶×144 = 72 μJ.",
        keyStep: "In series, Q is same on all capacitors; use 1/C_eq = Σ1/Cᵢ.",
      },
      {
        problem: "Using Gauss's law, find E at distance r outside a uniformly charged sphere of radius R with total charge Q.",
        solution: "Draw spherical Gaussian surface of radius r > R. All charge Q is enclosed. ∮E·dA = E×4πr² = Q/ε₀. Therefore E = Q/(4πε₀r²) = kQ/r².",
        keyStep: "Gaussian surface must have the same symmetry as the charge distribution to make E uniform on it.",
      },
      {
        problem: "A capacitor C=10μF is charged to 100V. A dielectric of κ=5 is inserted. Find new capacitance, voltage, and energy.",
        solution: "New C' = κC = 5×10 = 50 μF. Charge Q = CV = 10⁻⁵×100 = 10⁻³ C is conserved. New V' = Q/C' = 10⁻³/50×10⁻⁶ = 20 V. U_old = ½×10⁻⁵×10⁴ = 0.05 J. U_new = ½×50×10⁻⁶×400 = 0.01 J.",
        keyStep: "If capacitor is disconnected from battery before dielectric insertion, Q is conserved (not V).",
      },
    ],
    quickFire: [
      { q: "What is the SI unit of capacitance?", a: "Farad (F) = Coulomb/Volt" },
      { q: "Electric field inside a conductor in electrostatic equilibrium?", a: "Zero" },
      { q: "If capacitance increases by factor κ after dielectric, what happens to energy (battery disconnected)?", a: "Energy decreases by factor κ (U = Q²/2C, Q constant)" },
      { q: "Electric field due to infinite plane sheet of charge density σ?", a: "E = σ/2ε₀ (on each side)" },
      { q: "Two capacitors 6μF and 3μF in parallel. Equivalent?", a: "9 μF" },
      { q: "Energy stored in capacitor in terms of Q and C?", a: "U = Q²/2C" },
    ],
  },
  "current-electricity": {
    formulas: [
      { name: "Ohm's Law", formula: "V = IR", note: "Applies to ohmic conductors. Resistance R = ρL/A where ρ is resistivity, L is length, A is cross-section." },
      { name: "Kirchhoff's Current Law", formula: "ΣI_in = ΣI_out", note: "At every junction, current entering = current leaving. Apply systematically and solve simultaneous equations." },
      { name: "Kirchhoff's Voltage Law", formula: "ΣV = 0 (closed loop)", note: "Sum of all EMFs = sum of all voltage drops in a loop. Assign directions consistently." },
      { name: "Wheatstone Bridge Balance", formula: "P/Q = R/S", note: "When balanced, no current through galvanometer. Used in meter bridge: X/R = (100−L)/L." },
      { name: "RC Time Constant", formula: "τ = RC; q = Q₀(1−e^{−t/RC})", note: "Charging: q rises, V_C rises. Discharging: q = Q₀e^{−t/RC}. At t=τ, charge reaches 63.2% of final value." },
    ],
    examples: [
      {
        problem: "In a circuit, two resistors 4Ω and 6Ω are in parallel, connected in series with 2Ω. EMF = 10V, internal resistance = 1Ω. Find current through each resistor.",
        solution: "Parallel: 1/R_p = 1/4+1/6 = 5/12 → R_p = 2.4Ω. Total R = 2.4+2+1 = 5.4Ω. Total I = 10/5.4 = 1.85 A. V across parallel = 1.85×2.4 = 4.44V. I₁=4.44/4=1.11A, I₂=4.44/6=0.74A.",
        keyStep: "Find equivalent resistance of parallel combination first, then treat series circuit for total current.",
      },
      {
        problem: "In Wheatstone bridge, P=2Ω, Q=4Ω, R=3Ω. Find S for balance. If S is changed to 7Ω, in which direction does galvanometer deflect?",
        solution: "Balance: S = QR/P = 4×3/2 = 6Ω. With S=7Ω: P/Q=0.5, R/S=3/7=0.43. Since P/Q > R/S, current flows from B to D in galvanometer (deflects in specific direction).",
        keyStep: "Balance condition P/Q = R/S. If P/Q > R/S, V_B > V_D.",
      },
      {
        problem: "Capacitor C=100μF is charged through R=1kΩ from 12V supply. Find charge and voltage across C at t = RC = 0.1s.",
        solution: "Q_max = CV = 100×10⁻⁶×12 = 1200μC. At t=τ: q = Q_max(1−e⁻¹) = 1200×0.632 = 758.4μC. V_C = q/C = 758.4/100 = 7.58V.",
        keyStep: "At t = τ = RC, capacitor charges to 63.2% of final voltage.",
      },
    ],
    quickFire: [
      { q: "Series vs parallel: which gives higher resistance?", a: "Series always gives R_series > R_parallel (for same resistors)" },
      { q: "Power dissipated in resistor R with current I?", a: "P = I²R" },
      { q: "What is the condition for a balanced Wheatstone bridge?", a: "P/Q = R/S (no current through galvanometer)" },
      { q: "Terminal voltage of battery with EMF ε, internal resistance r, current I?", a: "V = ε − Ir" },
      { q: "At t=0, charge on capacitor in RC circuit starting from uncharged?", a: "Zero" },
    ],
  },
  "electromagnetic-induction-and-ac-circuits": {
    formulas: [
      { name: "Faraday's Law", formula: "EMF = −NdΦ/dt", note: "Φ = B·A·cosθ. Negative sign = Lenz's law (induced EMF opposes change in flux). N = number of turns." },
      { name: "Self-Inductance Energy", formula: "E = ½LI²", note: "L = NΦ/I. Analogous to ½mv² for kinetic energy. Inductor stores energy in magnetic field." },
      { name: "LCR Impedance", formula: "Z = √(R² + (X_L−X_C)²)", note: "X_L = ωL, X_C = 1/ωC. Phase angle: tan φ = (X_L−X_C)/R. Current lags voltage if X_L > X_C." },
      { name: "Resonance Frequency", formula: "ω₀ = 1/√(LC), f₀ = 1/(2π√LC)", note: "At resonance: Z = R (minimum), current is maximum. Q-factor = ω₀L/R." },
      { name: "Average Power", formula: "P_avg = V_rms I_rms cos φ", note: "cos φ = power factor. For pure R: cos φ=1. Pure L or C: cos φ=0 (wattless circuit)." },
    ],
    examples: [
      {
        problem: "A coil of 200 turns, area 10 cm², is placed in magnetic field B = 0.5 T. If B drops to zero in 0.02 s, find induced EMF.",
        solution: "ΔΦ = B·A = 0.5×10×10⁻⁴ = 5×10⁻⁴ Wb per turn. EMF = N×ΔΦ/Δt = 200×5×10⁻⁴/0.02 = 200×0.025 = 5 V.",
        keyStep: "EMF = N × (change in flux per turn) / time.",
      },
      {
        problem: "An LCR series circuit: L=0.5H, C=200μF, R=10Ω. Find resonant frequency and impedance at resonance.",
        solution: "ω₀ = 1/√(LC) = 1/√(0.5×200×10⁻⁶) = 1/√(10⁻⁴) = 100 rad/s. f₀ = 100/2π ≈ 15.9 Hz. At resonance, Z = R = 10Ω.",
        keyStep: "At resonance, X_L = X_C cancel, leaving only Z = R.",
      },
      {
        problem: "In AC circuit: V_rms=220V, I_rms=10A, power factor=0.8. Find average power and apparent power.",
        solution: "Apparent power = V_rms×I_rms = 220×10 = 2200 VA. Average (real) power = V_rms I_rms cos φ = 2200×0.8 = 1760 W.",
        keyStep: "Real power = apparent power × power factor. Power factor = R/Z.",
      },
    ],
    quickFire: [
      { q: "Lenz's law: direction of induced current?", a: "Opposes the change in flux that caused it" },
      { q: "At resonance in LCR, what is impedance?", a: "Z = R (minimum impedance)" },
      { q: "Unit of inductance?", a: "Henry (H)" },
      { q: "What is wattless current?", a: "Current in pure reactive (L or C) circuits — does no work, power factor = 0" },
      { q: "Transformer equation: V₁/V₂ = ?", a: "N₁/N₂ (turns ratio)" },
    ],
  },
  "modern-physics": {
    formulas: [
      { name: "Photoelectric Effect", formula: "KE_max = hν − φ = eV₀", note: "φ = work function = hν₀ (threshold). Stopping potential V₀ = (hν−φ)/e. No electrons if ν < ν₀." },
      { name: "Bohr's Atomic Model", formula: "E_n = −13.6/n² eV; r_n = n²a₀", note: "a₀ = 0.529 Å (Bohr radius). Energy of photon = |E_n2 − E_n1|. Lyman series: n→1, Balmer: n→2." },
      { name: "de Broglie Wavelength", formula: "λ = h/p = h/mv = h/√(2mKE)", note: "Applies to all particles. For accelerated electron: λ = 1.226/√V nm (V in volts)." },
      { name: "Radioactive Decay", formula: "N = N₀(½)^{t/t½} = N₀e^{−λt}", note: "Activity A = λN. Half-life t½ = 0.693/λ. Mean life = 1/λ = t½/0.693." },
      { name: "Mass-Energy Equivalence", formula: "Q = Δm × 931.5 MeV", note: "Δm in atomic mass units (u). Binding energy = (Zm_p + Nm_n − M_nucleus) × 931.5 MeV." },
    ],
    examples: [
      {
        problem: "Light of frequency 6×10¹⁴ Hz falls on metal with work function 2.1 eV. Find max KE of photoelectrons and stopping potential. (h=6.63×10⁻³⁴ J·s)",
        solution: "E = hν = 6.63×10⁻³⁴×6×10¹⁴ = 3.98×10⁻¹⁹ J = 2.49 eV. KE_max = 2.49 − 2.1 = 0.39 eV. Stopping potential V₀ = 0.39 V.",
        keyStep: "Convert hν to eV first (divide by 1.6×10⁻¹⁹), then subtract work function.",
      },
      {
        problem: "Electron jumps from n=4 to n=2 in hydrogen atom. Find wavelength of emitted photon.",
        solution: "E₄ = −13.6/16 = −0.85 eV. E₂ = −13.6/4 = −3.4 eV. ΔE = 3.4−0.85 = 2.55 eV. λ = hc/ΔE = (1240 eV·nm)/2.55 ≈ 486 nm (blue, Balmer series).",
        keyStep: "Use hc = 1240 eV·nm to convert energy difference to wavelength quickly.",
      },
      {
        problem: "Radioactive element has t½ = 5 years. What fraction of original atoms remain after 20 years?",
        solution: "Number of half-lives n = 20/5 = 4. Fraction remaining = (1/2)⁴ = 1/16.",
        keyStep: "Count number of half-lives = total time ÷ half-life. Then apply (1/2)^n.",
      },
    ],
    quickFire: [
      { q: "Threshold frequency formula?", a: "ν₀ = φ/h" },
      { q: "Energy of H-atom in ground state?", a: "−13.6 eV" },
      { q: "de Broglie wavelength of electron accelerated through V volts?", a: "λ = 1.226/√V nm" },
      { q: "Activity of radioactive sample when N atoms present (decay constant λ)?", a: "A = λN" },
      { q: "1 atomic mass unit = ? MeV", a: "931.5 MeV" },
      { q: "Balmer series: electron jumps to which orbit?", a: "n = 2" },
    ],
  },
  "optics-ray-wave": {
    formulas: [
      { name: "Snell's Law", formula: "n₁ sin θ₁ = n₂ sin θ₂", note: "Critical angle: sin θ_c = n₂/n₁ (going from denser to rarer). Total internal reflection when θ > θ_c." },
      { name: "Lens/Mirror Formula", formula: "1/v − 1/u = 1/f (lens); 1/v + 1/u = 1/f (mirror)", note: "Sign convention: distances in direction of incident ray are positive. Magnification m = −v/u (mirror), v/u (lens)." },
      { name: "YDSE Fringe Width", formula: "β = λD/d", note: "β = fringe width, D = screen distance, d = slit separation. Fringe shift due to slab: Δ = (μ−1)t·D/d." },
      { name: "Prism Formula", formula: "n = sin((A+δ_m)/2) / sin(A/2)", note: "At minimum deviation: r₁ = r₂ = A/2. Deviation increases then decreases as angle of incidence increases." },
      { name: "Malus's Law", formula: "I = I₀ cos²θ", note: "Intensity after analyser at angle θ to polariser. Unpolarised light through polariser → I₀/2." },
    ],
    examples: [
      {
        problem: "In YDSE, λ=600nm, D=1.5m, d=0.3mm. Find fringe width and position of 3rd bright fringe.",
        solution: "β = λD/d = 600×10⁻⁹×1.5/(0.3×10⁻³) = 3×10⁻³ m = 3 mm. 3rd bright: y₃ = 3β = 9 mm from centre.",
        keyStep: "β = λD/d. nth bright fringe at yₙ = nβ from centre.",
      },
      {
        problem: "An object is placed 15 cm from convex lens of focal length 10 cm. Find image position, nature and magnification.",
        solution: "1/v = 1/f + 1/u = 1/10 + 1/(−15) = 3/30 − 2/30 = 1/30. v = 30 cm (positive → real, same side as object for lens convention). m = v/u = 30/(−15) = −2 (real, inverted, magnified 2×).",
        keyStep: "Real image formed on opposite side. Negative m means inverted image.",
      },
      {
        problem: "Polarised light of intensity 40 W/m² passes through analyser at 60° to polarisation. Find transmitted intensity.",
        solution: "I = I₀cos²θ = 40×cos²60° = 40×(0.5)² = 40×0.25 = 10 W/m².",
        keyStep: "Malus's law: I = I₀cos²θ. At θ=90°, I=0; at θ=0°, I=I₀.",
      },
    ],
    quickFire: [
      { q: "YDSE: what happens to fringe width if wavelength increases?", a: "Fringe width increases (β = λD/d)" },
      { q: "Power of lens with f = 25 cm?", a: "P = 100/f(cm) = 100/25 = +4 D" },
      { q: "Critical angle for glass-air (n=1.5)?", a: "sin θ_c = 1/1.5 = 2/3 → θ_c ≈ 41.8°" },
      { q: "Malus's law: transmitted intensity at θ=45°?", a: "I = I₀/2" },
      { q: "Dispersive power formula?", a: "ω = (μ_V − μ_R)/(μ_Y − 1)" },
    ],
  },
  "laws-of-motion-and-work-energy": {
    formulas: [
      { name: "Newton's 2nd Law", formula: "F = ma", note: "Draw FBD first. In non-inertial frame, add pseudo-force (−ma) in opposite direction of acceleration." },
      { name: "Work-Energy Theorem", formula: "W_net = ΔKE = ½mv² − ½mu²", note: "Work by all forces equals change in KE. Variable force: W = ∫F·dx." },
      { name: "Conservation of Momentum", formula: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂", note: "Valid when no external force. For elastic collision: also KE conserved. Coefficient of restitution e = relative speed after/before." },
      { name: "Friction", formula: "f ≤ μₛN (static); f = μₖN (kinetic)", note: "Static > kinetic friction. μ = tan θ at limiting equilibrium on incline." },
      { name: "Spring PE", formula: "U = ½kx²", note: "Series springs: 1/k_eff = Σ1/kᵢ. Parallel springs: k_eff = Σkᵢ." },
    ],
    examples: [
      {
        problem: "A 5 kg block on surface (μ=0.3) is pulled by 25N at 37° above horizontal. Find acceleration (g=10).",
        solution: "F_x = 25cos37° = 20N. F_y = 25sin37° = 15N. N = mg − F_y = 50−15 = 35N. f = μN = 0.3×35 = 10.5N. a = (F_x−f)/m = (20−10.5)/5 = 9.5/5 = 1.9 m/s².",
        keyStep: "Always resolve inclined force into horizontal and vertical. Vertical component reduces normal force.",
      },
      {
        problem: "A 2 kg ball moving at 6 m/s collides elastically with stationary 6 kg ball. Find velocities after collision.",
        solution: "v₁ = (m₁−m₂)u₁/(m₁+m₂) = (2−6)×6/8 = −3 m/s. v₂ = 2m₁u₁/(m₁+m₂) = 2×2×6/8 = 3 m/s. Ball 1 bounces back at 3 m/s; ball 2 moves at 3 m/s.",
        keyStep: "For elastic collision, use both formulas: v₁ = (m₁−m₂)u₁/(m₁+m₂) and v₂ = 2m₁u₁/(m₁+m₂).",
      },
      {
        problem: "A block slides 5 m down a rough incline (angle=30°, μ=0.2). Find work done by friction and speed at bottom if started from rest (m=2kg, g=10).",
        solution: "N = mg cosθ = 2×10×cos30° = 17.3N. f = μN = 0.2×17.3 = 3.46N. W_friction = −f×d = −3.46×5 = −17.3 J. W_gravity = mgh = 2×10×5sin30° = 50J. By WE theorem: ½mv² = 50−17.3 = 32.7J → v = √(32.7) = 5.72 m/s.",
        keyStep: "Work by friction = −μN×d (always negative). Apply W_net = ΔKE.",
      },
    ],
    quickFire: [
      { q: "Pseudo force in non-inertial frame of acceleration a?", a: "F_pseudo = −ma (opposite to frame's acceleration)" },
      { q: "Work done by normal force?", a: "Zero (perpendicular to motion)" },
      { q: "Which is greater: static or kinetic friction coefficient?", a: "Static (μs > μk)" },
      { q: "Momentum conserved in all collisions?", a: "Yes, if no external force" },
      { q: "Spring constant k₁ and k₂ in series: equivalent k?", a: "k_eff = k₁k₂/(k₁+k₂)" },
    ],
  },
  "rotational-motion": {
    formulas: [
      { name: "Moment of Inertia", formula: "Ring: MR², Disc: ½MR², Sphere(solid): 2MR²/5", note: "Hollow sphere: 2MR²/3. Rod about centre: ML²/12. Rod about end: ML²/3. Memorise all 5." },
      { name: "Parallel Axis Theorem", formula: "I = I_cm + Md²", note: "d = distance between parallel axes. Always apply from CM axis. Very useful for finding I about any axis." },
      { name: "Angular Momentum", formula: "L = Iω; τ = dL/dt", note: "L conserved when τ_ext = 0. For point mass: L = mvr (sin of angle between r and v). I₁ω₁ = I₂ω₂ (conservation)." },
      { name: "Rolling Motion", formula: "v_cm = Rω; KE_total = ½mv²(1 + k²/R²)", note: "k²/R²: ring=1, hollow sphere=2/3, disc=1/2, solid sphere=2/5. Total KE = translational + rotational." },
      { name: "Torque", formula: "τ = r × F = rF sin θ = Iα", note: "Choose pivot to eliminate unknown forces. Equilibrium: Στ = 0 and ΣF = 0." },
    ],
    examples: [
      {
        problem: "A disc of mass 4 kg and radius 0.5 m spins at 10 rad/s. A ring of same mass and radius falls coaxially and sticks. Find new angular velocity.",
        solution: "I_disc = ½MR² = ½×4×0.25 = 0.5 kg·m². I_ring = MR² = 4×0.25 = 1 kg·m². L conservation: 0.5×10 = (0.5+1)×ω₂ → ω₂ = 5/1.5 = 10/3 rad/s.",
        keyStep: "Angular momentum L = Iω is conserved when τ_ext = 0.",
      },
      {
        problem: "A solid sphere of mass 2 kg and radius 0.1 m rolls without slipping at v=5 m/s. Find total KE.",
        solution: "For solid sphere: KE = ½mv²(1+2/5) = ½×2×25×(7/5) = 25×7/5 = 35 J. Check: KE_trans = ½×2×25=25J, KE_rot = ½×(2MR²/5)×(v/R)² = ½×(2×2×0.01/5)×2500 = 10J. Total = 35J ✓.",
        keyStep: "For rolling, use KE = ½mv²(1+k²/R²) where k²/R² = 2/5 for solid sphere.",
      },
      {
        problem: "Rod (mass M, length L) balanced at centre. 3M mass placed at one end. Where to place M mass for balance?",
        solution: "Taking moments about centre: 3M × L/2 = M × d. d = 3L/2. But this is beyond the rod, so 3M × L/2 on left requires M at distance 3L/2 on right.",
        keyStep: "For rotational equilibrium, sum of clockwise torques = sum of anticlockwise torques about any pivot.",
      },
    ],
    quickFire: [
      { q: "MI of solid sphere about diameter?", a: "2MR²/5" },
      { q: "Speed of topmost point of rolling disc (speed v_cm)?", a: "2v_cm" },
      { q: "Perpendicular axis theorem: I_z = ?", a: "I_x + I_y (for laminar bodies)" },
      { q: "If moment of inertia doubles (L conserved), ω becomes?", a: "Half (ω₂ = ω₁/2)" },
      { q: "Ratio of rotational to translational KE for solid sphere rolling?", a: "2:5" },
    ],
  },
  "waves-and-shm": {
    formulas: [
      { name: "SHM Equations", formula: "x = A sin(ωt+φ); v = Aω cos(ωt+φ); a = −ω²x", note: "ω = 2πf = 2π/T. v_max = Aω at x=0. a_max = ω²A at x=±A. v = ω√(A²−x²)." },
      { name: "Time Periods", formula: "Spring: T=2π√(m/k); Pendulum: T=2π√(L/g)", note: "Simple pendulum T independent of mass and amplitude (for small oscillations). Spring: independent of g." },
      { name: "SHM Energy", formula: "E_total = ½kA²; KE = ½k(A²−x²); PE = ½kx²", note: "Total energy constant. At x=0: KE max, PE=0. At x=±A: PE max, KE=0. Average KE = Average PE = E/2." },
      { name: "Wave Speed", formula: "v = √(T/μ) for strings; v = √(γP/ρ) for gases", note: "v = fλ always. Standing waves: nodes at fixed ends, antinodes at free ends." },
      { name: "Beats", formula: "f_beats = |f₁ − f₂|", note: "Open pipe: f_n = nv/2L. Closed pipe: f_n = (2n−1)v/4L (only odd harmonics). Open has all harmonics." },
    ],
    examples: [
      {
        problem: "A spring-mass system (k=400 N/m, m=0.4 kg) oscillates with amplitude 5 cm. Find T, v_max, a_max, and energy.",
        solution: "ω = √(k/m) = √1000 = 31.6 rad/s. T = 2π/ω = 0.199 s ≈ 0.2 s. v_max = Aω = 0.05×31.6 = 1.58 m/s. a_max = ω²A = 1000×0.05 = 50 m/s². E = ½kA² = ½×400×0.0025 = 0.5 J.",
        keyStep: "Compute ω first from √(k/m). All other quantities follow from ω and A.",
      },
      {
        problem: "Two tuning forks of frequencies 256 Hz and 260 Hz are sounded together. Find beat frequency and time between consecutive beats.",
        solution: "f_beat = |260−256| = 4 Hz. Time between beats = 1/f_beat = 0.25 s. The sound intensity waxes and wanes 4 times per second.",
        keyStep: "Beat frequency = |f₁−f₂|. If beats decrease when one fork is loaded (mass added), the original frequency was lower.",
      },
      {
        problem: "A particle in SHM: x = 10 sin(2t) cm. At t=π/4, find KE and PE as fractions of total energy.",
        solution: "ω=2, A=10cm. x at t=π/4: x = 10sin(π/2) = 10cm = A. So at t=π/4, particle is at amplitude. KE = ½k(A²−x²) = 0. PE = ½kA² = E_total. KE/E = 0%, PE/E = 100%.",
        keyStep: "At amplitude (x=A), all energy is PE; at mean position (x=0), all energy is KE.",
      },
    ],
    quickFire: [
      { q: "v_max in SHM?", a: "Aω (at mean position x=0)" },
      { q: "Fundamental frequency of closed organ pipe length L?", a: "f = v/4L" },
      { q: "Time period of pendulum on moon (g_moon = g/6)?", a: "T_moon = √6 × T_earth" },
      { q: "At what position in SHM is KE = PE?", a: "x = A/√2" },
      { q: "What happens to beat frequency if f₂ increases (f₂ was slightly > f₁)?", a: "Beat frequency increases" },
    ],
  },
  "chemical-bonding-and-molecular-structure": {
    formulas: [
      { name: "VSEPR: Electron Pairs", formula: "Geometry = f(BP + LP)", note: "2: linear, 3: trigonal planar, 4: tetrahedral, 5: TBP, 6: octahedral. Each LP reduces ideal angles." },
      { name: "Hybridisation Count", formula: "Hyb = σ bonds + lone pairs on central atom", note: "2→sp, 3→sp², 4→sp³, 5→sp³d, 6→sp³d². Count only σ bonds (single bonds and one bond of each multiple bond)." },
      { name: "Bond Order (MOT)", formula: "BO = (bonding e⁻ − antibonding e⁻)/2", note: "Higher BO = shorter bond, stronger bond. BO=0 means molecule doesn't exist. Odd electrons → paramagnetic." },
      { name: "Dipole Moment", formula: "μ = q × d (Debye)", note: "Net μ = vector sum. Symmetric molecules cancel: CCl₄, BF₃, CO₂, XeF₄ → μ=0. Bent/pyramidal → μ≠0." },
    ],
    examples: [
      {
        problem: "Determine shape and hybridisation of SF₆.",
        solution: "S has 6 bonding pairs + 0 lone pairs → sp³d² hybridisation → octahedral geometry. Bond angle 90°. All bonds equivalent.",
        keyStep: "Count only σ bonds and lone pairs on central atom for hybridisation.",
      },
      {
        problem: "Using MOT, find bond order and magnetic nature of N₂.",
        solution: "N₂ has 14 electrons. MO filling: σ1s²σ*1s²σ2s²σ*2s²π2p⁴σ2p². Bonding=10, antibonding=4. BO=(10−4)/2=3. No unpaired electrons → diamagnetic. Triple bond confirmed.",
        keyStep: "Fill MOs in energy order. BO = (bonding−antibonding)/2.",
      },
      {
        problem: "Explain why HF has higher boiling point than HCl despite lower molecular mass.",
        solution: "F is most electronegative, smallest. O-H and N-H can H-bond, but F-H bond is strongest H-bond. HF forms F-H---F type strong H-bonds → intermolecular forces much stronger → higher boiling point than HCl (van der Waals only).",
        keyStep: "H-bonding requires: H bonded to F, O, or N; lone pair on F, O, or N nearby.",
      },
    ],
    quickFire: [
      { q: "Shape of CO₂?", a: "Linear (sp, no lone pairs, 2 bond pairs)" },
      { q: "Bond order of O₂?", a: "2 (double bond)" },
      { q: "Which has higher BP: H₂O or H₂S?", a: "H₂O (strong H-bonding)" },
      { q: "Hybridisation of N in NH₃?", a: "sp³ (3 BP + 1 LP)" },
      { q: "Net dipole moment of CCl₄?", a: "Zero (tetrahedral symmetry cancels)" },
    ],
  },
  "coordination-compounds": {
    formulas: [
      { name: "IUPAC Naming Rule", formula: "Ligands (alphabetical) + Metal (ox. state) + anion", note: "Inner sphere: complex ion. Outer sphere: counter ion. Cationic ligands: -ium. Anionic ligands: -o. Neutral: as is (aqua, ammine, carbonyl)." },
      { name: "Crystal Field Splitting", formula: "Δ_oct > Δ_tet; Δ_tet ≈ 4/9 Δ_oct", note: "Strong field (large Δ) → low spin (pair up). Weak field → high spin. Spectrochemical series: I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ < CO." },
      { name: "Magnetic Moment", formula: "μ = √(n(n+2)) BM", note: "n = number of unpaired electrons. Count unpaired d electrons for each configuration (high vs low spin)." },
      { name: "EAN Rule", formula: "EAN = Z − ox.state + 2×(no. of ligands)", note: "Stable when EAN = 36 (Kr), 54 (Xe), or 86 (Rn)." },
    ],
    examples: [
      {
        problem: "Name [Fe(H₂O)₄(OH)₂]Cl and find oxidation state of Fe.",
        solution: "Charge balance: x + 4(0) + 2(−1) + (−1)_outer = 0 (neutral complex with Cl outside). Wait: [Fe(H₂O)₄(OH)₂]Cl → x − 2 = +1 → x = +3. IUPAC: tetraaquadihydroxidoiron(III) chloride. Ligands alphabetical: aqua before hydroxido.",
        keyStep: "Find oxidation state first: sum of charges in complex ion = overall charge. Then name ligands alphabetically.",
      },
      {
        problem: "For [Co(NH₃)₆]³⁺, determine spin state and magnetic moment (Co: Z=27, +3 state has d⁶).",
        solution: "Co³⁺ is d⁶. NH₃ is strong field → low spin. Pairing: t₂g⁶ eg⁰. Unpaired electrons = 0. μ = √(0×2) = 0 BM. Diamagnetic.",
        keyStep: "NH₃, en, CN⁻, CO are strong field → low spin. H₂O, F⁻, Cl⁻ are weak field → high spin.",
      },
      {
        problem: "[Pt(NH₃)₂Cl₂]: identify type and number of isomers.",
        solution: "Pt(II) is d⁸ → square planar. [MA₂B₂] type: shows geometric isomerism (cis and trans). 2 geometric isomers. The cis form is the anticancer drug cisplatin.",
        keyStep: "Square planar MA₂B₂ always shows cis-trans isomerism.",
      },
    ],
    quickFire: [
      { q: "What does 'ammine' vs 'amine' mean in coordination?", a: "Ammine = NH₃ ligand; amine = organic R-NH₂ (different ligand)" },
      { q: "Strongest field ligand in spectrochemical series?", a: "CO > CN⁻" },
      { q: "μ for 3 unpaired electrons?", a: "μ = √(3×5) = √15 ≈ 3.87 BM" },
      { q: "Stability of complex: more ligands or higher charge?", a: "Both increase stability (hard-soft acid-base also matters)" },
      { q: "Chelate effect: why are chelates more stable?", a: "Entropy increases on chelation (multiple donor atoms per ligand → fewer molecules released)" },
    ],
  },
  "p-block-elements": {
    formulas: [
      { name: "Oxyacids of P: Basicity", formula: "Basicity = no. of P-OH groups", note: "H₃PO₄ (3 OH): tribasic, +5. H₃PO₃ (2 OH): dibasic, +3. H₃PO₂ (1 OH): monobasic, +1. P-H bonds don't ionise." },
      { name: "Halogen Reactivity", formula: "F₂ > Cl₂ > Br₂ > I₂ (oxidising power)", note: "Bond energy anomaly: F₂ lowest (159 kJ/mol < Cl₂ 243 kJ/mol) due to lone pair repulsion in small F. Electron affinity highest for Cl, not F." },
      { name: "Contact Process (H₂SO₄)", formula: "2SO₂ + O₂ → 2SO₃ (V₂O₅, 450°C); SO₃ + H₂SO₄ → oleum", note: "Never dissolve SO₃ directly in water (violent reaction). Use oleum (H₂S₂O₇), then dilute." },
      { name: "Noble Gas Compounds", formula: "XeF₂: linear; XeF₄: square planar; XeF₆: distorted octahedral", note: "XeO₃: pyramidal (like NH₃). Fluorides of Xe are stable due to high F oxidising power." },
    ],
    examples: [
      {
        problem: "Identify P oxidation states in H₃PO₄, H₄P₂O₇, and HPO₃.",
        solution: "H₃PO₄: 3(+1)+x+4(−2)=0 → x=+5. H₄P₂O₇ (pyrophosphoric acid): 4(+1)+2x+7(−2)=0 → 2x=10 → x=+5. HPO₃ (metaphosphoric acid): +1+x+3(−2)=0 → x=+5. All three have P in +5 state.",
        keyStep: "Sum of oxidation states = 0 for neutral compounds. H=+1, O=−2 always here.",
      },
      {
        problem: "Compare oxidising power of F₂ and Cl₂. Why is F₂ the strongest despite lowest electron affinity of halogens?",
        solution: "F₂ is strongest oxidising agent due to: (1) lowest bond dissociation energy (most easily dissociated), (2) high hydration enthalpy of F⁻ (compensates lower EA), (3) smallest size enables better orbital overlap. Cl has higher EA but overall thermodynamics favour F₂.",
        keyStep: "Oxidising power determined by overall ΔG of reaction, not just electron affinity.",
      },
      {
        problem: "H₃PO₃ is dibasic but H₃PO₂ is monobasic. Explain using structure.",
        solution: "H₃PO₃ has 2 P-OH groups (acidic) and 1 P-H bond (non-ionisable). H₃PO₂ has 1 P-OH group and 2 P-H bonds. Only P-OH hydrogens ionise. Hence dibasic vs monobasic. Both are reducing agents (have P-H bonds).",
        keyStep: "P-H bonds in oxyacids make them reducing agents. P-OH bonds determine basicity.",
      },
    ],
    quickFire: [
      { q: "Which group 15 element cannot form pentavalent compounds?", a: "Nitrogen (no d-orbitals to expand valence)" },
      { q: "Haber process is for?", a: "NH₃ synthesis: N₂ + 3H₂ ⇌ 2NH₃ (Fe catalyst, 450°C, 200 atm)" },
      { q: "Interhalogen compound: ICl₃ has which geometry?", a: "T-shaped (sp³d, 2 LP + 3 BP)" },
      { q: "Why is F₂ bond energy lower than Cl₂?", a: "Lone-pair repulsion between small F atoms" },
      { q: "XeF₄ geometry?", a: "Square planar (6 electron pairs: 4 BP + 2 LP → octahedral → square planar)" },
    ],
  },
  "chemical-and-ionic-equilibrium": {
    formulas: [
      { name: "Kp−Kc Relation", formula: "Kp = Kc(RT)^Δn", note: "Δn = moles of gaseous products − moles of gaseous reactants. R = 0.0821 L·atm/mol·K (if P in atm)." },
      { name: "pH Formulas", formula: "Strong acid: pH=−log[H⁺]; Weak acid: pH=½(pKa−logC)", note: "pOH = −log[OH⁻]. pH + pOH = 14 at 25°C. For weak base: pOH = ½(pKb − logC)." },
      { name: "Henderson-Hasselbalch", formula: "pH = pKa + log([A⁻]/[HA])", note: "Buffer capacity maximum when [A⁻]=[HA] → pH = pKa. Buffers resist pH change in range pKa ± 1." },
      { name: "Solubility Product", formula: "Ksp = [M^n+]^a[X^m-]^b", note: "For AxBy: Ksp = (as)^a(bs)^b where s = solubility. Common ion effect: adding common ion decreases solubility." },
      { name: "Le Chatelier's Principle", formula: "↑pressure → fewer moles; ↑temp → endothermic direction", note: "Adding inert gas at constant volume: no effect. Adding inert gas at constant pressure: shifts to more moles side." },
    ],
    examples: [
      {
        problem: "Calculate pH of 0.1 M CH₃COOH solution. Ka = 1.8×10⁻⁵.",
        solution: "pH = ½(pKa − logC). pKa = −log(1.8×10⁻⁵) ≈ 4.74. pH = ½(4.74 − log0.1) = ½(4.74+1) = ½(5.74) = 2.87.",
        keyStep: "For weak acid: pH = ½(pKa + pC) where pC = −logC = 1 for 0.1M.",
      },
      {
        problem: "Ksp of PbI₂ = 1.4×10⁻⁸. Find solubility in (a) pure water, (b) 0.1 M KI solution.",
        solution: "(a) PbI₂ ⇌ Pb²⁺ + 2I⁻. Ksp = s(2s)² = 4s³ = 1.4×10⁻⁸ → s = (1.4×10⁻⁸/4)^{1/3} ≈ 1.52×10⁻³ M. (b) In 0.1M KI: [I⁻]≈0.1M. Ksp = s×(0.1)² → s = 1.4×10⁻⁸/0.01 = 1.4×10⁻⁶ M (100× lower).",
        keyStep: "Common ion effect dramatically reduces solubility. In KI solution, [I⁻] = 0.1+2s ≈ 0.1.",
      },
      {
        problem: "N₂ + 3H₂ ⇌ 2NH₃; Kc = 3.7×10⁸ at 25°C. Find Kp at 25°C (T=298K).",
        solution: "Δn = 2−4 = −2. Kp = Kc(RT)^Δn = 3.7×10⁸ × (0.0821×298)^{−2} = 3.7×10⁸/(24.45)² = 3.7×10⁸/597.8 = 6.19×10⁵.",
        keyStep: "Use RT in L·atm/mol: R=0.0821, T in K. Kp < Kc when Δn < 0.",
      },
    ],
    quickFire: [
      { q: "pH of pure water at 25°C?", a: "7 (Kw = 10⁻¹⁴, [H⁺]=[OH⁻]=10⁻⁷)" },
      { q: "Buffer works best at pH = ?", a: "pH = pKa (when [acid]=[salt])" },
      { q: "If Kc is large, reaction is?", a: "Favours products (nearly complete forward reaction)" },
      { q: "Adding more reactant at equilibrium: what happens?", a: "Equilibrium shifts right (forward), Kc unchanged" },
      { q: "Common ion effect on solubility?", a: "Decreases solubility" },
    ],
  },
  "electrochemistry": {
    formulas: [
      { name: "Cell EMF", formula: "E°_cell = E°_cathode − E°_anode", note: "Higher SRP = cathode (reduction). Positive E°_cell = spontaneous reaction. ΔG° = −nFE°_cell." },
      { name: "Nernst Equation (298K)", formula: "E = E° − (0.0591/n) log Q", note: "Q = reaction quotient. At equilibrium E = 0, so log K = nE°/0.0591." },
      { name: "Faraday's First Law", formula: "m = (M × I × t)/(n × F)", note: "F = 96500 C/mol. n = electrons transferred per atom. m in grams, M = molar mass, I in A, t in seconds." },
      { name: "Kohlrausch's Law", formula: "Λ°m = ν₊λ°₊ + ν₋λ°₋", note: "Limiting molar conductance = sum of individual ion conductances. α = Λm/Λ°m for weak electrolytes." },
    ],
    examples: [
      {
        problem: "Calculate E_cell for Zn|Zn²⁺(0.1M)||Cu²⁺(0.01M)|Cu. E°(Zn²⁺/Zn) = −0.76V, E°(Cu²⁺/Cu) = +0.34V.",
        solution: "E°_cell = 0.34−(−0.76) = 1.10V. n=2. Q = [Zn²⁺]/[Cu²⁺] = 0.1/0.01 = 10. E = 1.10 − (0.0591/2)log10 = 1.10 − 0.0296 = 1.0704 V ≈ 1.07V.",
        keyStep: "Q for electrochemical cell = [products oxidised]/[reactants] = [Zn²⁺]/[Cu²⁺].",
      },
      {
        problem: "How many grams of Cu deposit when 2A current flows through CuSO₄ for 30 min? (M_Cu=64, n=2, F=96500)",
        solution: "t = 30×60 = 1800 s. m = (M×I×t)/(nF) = (64×2×1800)/(2×96500) = 230400/193000 = 1.194 g.",
        keyStep: "Convert time to seconds. n = 2 for Cu²⁺ → Cu.",
      },
      {
        problem: "E°_cell = 1.10V for Zn-Cu cell (n=2). Find equilibrium constant K at 298K.",
        solution: "log K = nE°/0.0591 = 2×1.10/0.0591 = 2.20/0.0591 = 37.2. K = 10^{37.2} ≈ 1.6×10³⁷.",
        keyStep: "At equilibrium E=0. Use log K = nE°_cell/0.0591.",
      },
    ],
    quickFire: [
      { q: "In electrolytic cell, reduction occurs at?", a: "Cathode (connected to negative terminal)" },
      { q: "Unit of molar conductance?", a: "S·cm²/mol (or S·m²/mol)" },
      { q: "Faraday's second law?", a: "Same charge → mass deposited ∝ equivalent weight" },
      { q: "Which battery is rechargeable: lead-acid or dry cell?", a: "Lead-acid (secondary battery)" },
      { q: "Degree of dissociation α = ?", a: "Λm/Λ°m (for weak electrolyte)" },
    ],
  },
  "general-organic-chemistry-goc": {
    formulas: [
      { name: "Inductive Effect (−I / +I)", formula: "+I: alkyl > H; −I: halogens, NO₂, CN", note: "−I substituents on RCOOH increase acidity (stabilise RCOO⁻). +I substituents on RNH₂ increase basicity." },
      { name: "Resonance (+M / −M)", formula: "+M: NH₂, OH, OR; −M: NO₂, CHO, COOH", note: "Both −I and −M = strongly deactivating (e.g., NO₂). +M with −I = still activating (e.g., Cl in electrophilic aromatic)." },
      { name: "Carbocation Stability", formula: "3° > 2° > 1° > CH₃⁺ (inductive)", note: "Allylic/benzylic > 3° (resonance dominates over inductive). Bridgehead carbocations are very unstable." },
      { name: "SN1 vs SN2", formula: "SN1: 3°, polar protic; SN2: 1°, polar aprotic, backside", note: "SN2: clean inversion (Walden). SN1: racemisation (via planar carbocation). Neopentyl: very slow SN2 (steric)." },
    ],
    examples: [
      {
        problem: "Arrange in decreasing acidity: CH₃COOH, CCl₃COOH, CF₃COOH, CBr₃COOH.",
        solution: "Acidity determined by stability of conjugate base (carboxylate). −I effect: F > Cl > Br (electronegativity order). CF₃COOH > CCl₃COOH > CBr₃COOH > CH₃COOH.",
        keyStep: "More electronegative substituents → stronger −I effect → more stable anion → stronger acid.",
      },
      {
        problem: "Give the mechanism and product of 2-bromopropane + KOH(aq) vs + NaOEt (strong base).",
        solution: "With KOH(aq): SN1/SN2 → substitution product 2-propanol (mainly). With NaOEt (strong bulky base): E2 elimination dominates → propene (Zaitsev product: more substituted alkene).",
        keyStep: "Strong bulky base favours elimination (E2). Weak, good nucleophile favours substitution (SN).",
      },
      {
        problem: "Rank stability: allyl cation, benzyl cation, tert-butyl cation, methyl cation.",
        solution: "Benzyl ≈ Allyl (extensive resonance) > t-Bu (hyperconjugation) >> CH₃⁺. More precisely: benzyl > allyl > 3° > 2° > 1° > methyl.",
        keyStep: "Resonance stabilisation > hyperconjugation. Conjugated systems (allyl, benzyl) most stable.",
      },
    ],
    quickFire: [
      { q: "SN2: what happens to stereochemistry?", a: "Complete inversion of configuration (Walden inversion)" },
      { q: "Which is stronger: HCOOH or CH₃COOH?", a: "HCOOH (no +I alkyl group to destabilise HCOO⁻)" },
      { q: "+M effect group example?", a: "−NH₂, −OH, −OR (donate electrons by resonance)" },
      { q: "Meso compound: chiral or achiral?", a: "Achiral (internal plane of symmetry despite chiral centres)" },
      { q: "R configuration: priorities go?", a: "Clockwise when lowest priority (4) points away = R" },
    ],
  },
  "carbonyl-compounds": {
    formulas: [
      { name: "Reactivity of Carbonyl", formula: "HCHO > RCHO > ArCHO > RCOR'", note: "More alkyl groups reduce electrophilicity of carbonyl carbon. Aldehydes > ketones for nucleophilic addition." },
      { name: "Aldol Condensation", formula: "2RCHO → β-hydroxy aldehyde (→ α,β-unsaturated, heat)", note: "Requires α-hydrogen. Base removes α-H → enolate attacks another molecule. Crossed aldol: use different aldehydes (or one without α-H)." },
      { name: "Cannizzaro Reaction", formula: "2HCHO + NaOH → CH₃OH + HCOONa", note: "No α-H needed. Disproportionation: one molecule oxidised, one reduced. HCHO, C₆H₅CHO, (CH₃)₃CCHO undergo this." },
      { name: "Haloform Reaction", formula: "CH₃CO-R + X₂/NaOH → RCOONa + CHX₃", note: "Positive for: acetaldehyde (CH₃CHO), acetone (CH₃COCH₃), ethanol (oxidised to CH₃CHO). Yellow ppt = iodoform (CHI₃)." },
    ],
    examples: [
      {
        problem: "Which compounds give positive iodoform test: (a) CH₃OH, (b) C₂H₅OH, (c) CH₃COCH₃, (d) HCHO?",
        solution: "(a) CH₃OH: no. (b) C₂H₅OH: yes (oxidised to CH₃CHO which has CH₃CO- group). (c) CH₃COCH₃: yes (has CH₃CO- group). (d) HCHO: no (no CH₃ on carbonyl).",
        keyStep: "Iodoform positive if compound has CH₃CO- group, or CH₃CH(OH)- group (oxidises to CH₃CO-).",
      },
      {
        problem: "What is the product of acetaldehyde with dilute NaOH? Write the structure.",
        solution: "Aldol condensation: 2CH₃CHO → CH₃CH(OH)CH₂CHO (3-hydroxybutanal, 'aldol'). With heat, dehydration gives CH₃CH=CHCHO (but-2-enal, crotonaldehyde).",
        keyStep: "Aldol needs base + α-H. Product is β-hydroxy carbonyl compound. Heat → dehydration → α,β-unsaturated.",
      },
      {
        problem: "Compare Clemmensen and Wolf-Kishner reductions. When to use each?",
        solution: "Both reduce C=O to CH₂ (deoxygenation). Clemmensen: Zn(Hg)/HCl → use for acid-sensitive substrates. Wolf-Kishner: NH₂NH₂/KOH/heat → use when substrate is base-stable but acid-sensitive.",
        keyStep: "Clemmensen = acidic conditions. Wolf-Kishner = basic conditions. Both give same product.",
      },
    ],
    quickFire: [
      { q: "Does HCHO undergo Cannizzaro or Aldol?", a: "Cannizzaro (no α-hydrogen)" },
      { q: "Which reagent reduces aldehyde to alcohol (mild)?", a: "NaBH₄ or LiAlH₄" },
      { q: "Clemmensen reduction reagent?", a: "Zn-Hg amalgam / concentrated HCl" },
      { q: "Product of benzaldehyde + conc. NaOH?", a: "Benzyl alcohol + sodium benzoate (Cannizzaro)" },
      { q: "Aldol product from acetone?", a: "Diacetone alcohol: (CH₃)₂C(OH)CH₂COCH₃" },
    ],
  },
  "polymers-and-biomolecules": {
    formulas: [
      { name: "Addition Polymers", formula: "nCH₂=CHR → (−CH₂−CHR−)_n", note: "No byproduct. Free radical/ionic/Ziegler-Natta initiation. Examples: PE, PVC, polystyrene, teflon (PTFE), neoprene." },
      { name: "Condensation Polymers", formula: "Monomers + loss of H₂O (or HCl)", note: "Nylon-6,6: diamine + diacid. Nylon-6: caprolactam ring opening. Dacron/PET: glycol + terephthalic acid. Bakelite: phenol + formaldehyde." },
      { name: "Carbohydrates", formula: "Glucose: C₆H₁₂O₆; Sucrose: C₁₂H₂₂O₁₁", note: "Reducing sugars: free hemiacetal/hemiketal (all monosaccharides, maltose, lactose). Non-reducing: sucrose (glycosidic bond locks both anomers)." },
      { name: "H-bonding in DNA", formula: "A-T: 2 H-bonds; G-C: 3 H-bonds", note: "G-C is stronger pair. RNA is single stranded. T in DNA → U in RNA. DNA double helix: right-handed, B-form in vivo." },
    ],
    examples: [
      {
        problem: "Classify: (a) PVC, (b) nylon-6,6, (c) starch, (d) Bakelite, (e) natural rubber.",
        solution: "(a) PVC: addition polymer, synthetic, thermoplastic. (b) Nylon-6,6: condensation, synthetic, thermoplastic. (c) Starch: natural, condensation (polysaccharide of glucose). (d) Bakelite: condensation, synthetic, thermosetting. (e) Natural rubber: addition polymer, natural.",
        keyStep: "Key distinction: addition (no byproduct) vs condensation (lose H₂O or similar). Thermoplastic vs thermosetting = can remelt vs cannot.",
      },
      {
        problem: "How many H-bonds are in a DNA segment with 40% adenine bases?",
        solution: "If A=40%, then T=40% (A-T pairs), G=C=10% each. A-T: 2 H-bonds each. G-C: 3 H-bonds each. For 100 base pairs: 40(A-T)×2 + 10(G-C)×3 = 80+30 = 110 H-bonds.",
        keyStep: "A pairs with T (2 H-bonds), G pairs with C (3 H-bonds). A%=T% and G%=C% always.",
      },
      {
        problem: "Give monomers and polymer type for: Dacron, Nylon-6, Buna-S.",
        solution: "Dacron: ethylene glycol + terephthalic acid → condensation (polyester). Nylon-6: caprolactam → addition (ring opening). Buna-S: butadiene + styrene → addition (copolymer). Buna-S is synthetic rubber.",
        keyStep: "Ring-opening polymerisation (caprolactam → Nylon-6) is technically addition type (no small molecule lost).",
      },
    ],
    quickFire: [
      { q: "Monomer of PVC?", a: "Vinyl chloride (CH₂=CHCl)" },
      { q: "Reducing vs non-reducing sugar: sucrose is?", a: "Non-reducing (no free hemiacetal group)" },
      { q: "20 natural amino acids: how many are essential?", a: "9 essential amino acids" },
      { q: "Primary structure of protein?", a: "Sequence of amino acids (peptide bonds)" },
      { q: "Which sugar is found in DNA vs RNA?", a: "DNA: deoxyribose; RNA: ribose" },
    ],
  },
  "calculus-integration": {
    formulas: [
      { name: "Standard Integrals", formula: "∫xⁿ = xⁿ⁺¹/(n+1)+C; ∫eˣ=eˣ+C; ∫1/x=ln|x|+C", note: "Also: ∫sinx=−cosx, ∫cosx=sinx, ∫tan x=ln|sec x|, ∫sec²x=tan x, ∫1/√(1−x²)=sin⁻¹x." },
      { name: "Integration by Substitution", formula: "∫f(g(x))g'(x)dx = ∫f(u)du where u=g(x)", note: "Look for composite function where numerator ∝ derivative of denominator. Convert limits if definite." },
      { name: "Integration by Parts (ILATE)", formula: "∫u·v dx = u∫v dx − ∫(u'·∫v dx) dx", note: "ILATE priority for u: Inverse trig > Log > Algebraic > Trig > Exponential." },
      { name: "Definite Integral Properties", formula: "∫₀ᵃf(x)dx = ∫₀ᵃf(a−x)dx", note: "Also: ∫_{−a}^a f(x)dx = 2∫₀ᵃ f(x)dx if f is even, = 0 if odd. Very useful for symmetric limits." },
      { name: "Area Under Curve", formula: "A = ∫_a^b |f(x)|dx", note: "Area between two curves: ∫|f(x)−g(x)|dx. Find intersection points first." },
    ],
    examples: [
      {
        problem: "Evaluate ∫₀^(π/2) sin²x dx.",
        solution: "sin²x = (1−cos2x)/2. ∫₀^(π/2) sin²x dx = ∫₀^(π/2) (1−cos2x)/2 dx = [x/2 − sin2x/4]₀^(π/2) = π/4 − 0 − (0−0) = π/4.",
        keyStep: "Use sin²x = (1−cos2x)/2 to linearise before integrating.",
      },
      {
        problem: "Evaluate ∫₀^(π/2) sinx/(sinx+cosx) dx using symmetry property.",
        solution: "Let I = ∫₀^(π/2) sinx/(sinx+cosx)dx. Using f(a−x): I = ∫₀^(π/2) cosx/(cosx+sinx)dx. Adding: 2I = ∫₀^(π/2) 1 dx = π/2. So I = π/4.",
        keyStep: "The property ∫₀ᵃf(x)dx = ∫₀ᵃf(a−x)dx is the most powerful tool for symmetric integrals.",
      },
      {
        problem: "Find area enclosed between y=x and y=x².",
        solution: "Intersections: x=x² → x(x−1)=0 → x=0 and x=1. A = ∫₀¹(x−x²)dx = [x²/2 − x³/3]₀¹ = 1/2−1/3 = 1/6 sq. units.",
        keyStep: "Identify which curve is upper (x > x² for x∈(0,1)). Area = ∫(upper−lower)dx.",
      },
    ],
    quickFire: [
      { q: "∫eˣ dx = ?", a: "eˣ + C" },
      { q: "ILATE: what does L stand for?", a: "Logarithmic functions (2nd priority for u)" },
      { q: "∫₀^π sinx dx = ?", a: "2" },
      { q: "Property: ∫_{−a}^a (odd function) dx = ?", a: "0" },
      { q: "∫ dx/√(1−x²) = ?", a: "sin⁻¹x + C" },
    ],
  },
  "calculus-limits-continuity-and-differentiability": {
    formulas: [
      { name: "Standard Limits", formula: "sin x/x → 1; tan x/x → 1; (eˣ−1)/x → 1 as x→0", note: "Also: (aˣ−1)/x → ln a; (1+x)^(1/x) → e; lim(1+1/n)^n = e. All as x→0 or n→∞." },
      { name: "L'Hôpital's Rule", formula: "lim f(x)/g(x) = lim f'(x)/g'(x) for 0/0 or ∞/∞", note: "Differentiate numerator and denominator separately. Apply repeatedly if still 0/0. Not applicable for other indeterminate forms without converting." },
      { name: "Continuity", formula: "LHL = RHL = f(a)", note: "Left and right limits must equal function value. Polynomials, sin, cos, eˣ are everywhere continuous." },
      { name: "Differentiability", formula: "LHD = RHD at point of interest", note: "If differentiable → continuous (converse not true). |x|, [x] are continuous but not differentiable at certain points." },
    ],
    examples: [
      {
        problem: "Find lim(x→1) (x³−1)/(x−1).",
        solution: "Method 1: Factor: (x³−1)/(x−1) = x²+x+1. At x=1: = 1+1+1 = 3. Method 2: L'Hôpital (0/0): d/dx(x³−1)=3x², d/dx(x−1)=1. Limit = 3×1²/1 = 3.",
        keyStep: "Factorise (xⁿ−aⁿ) = (x−a)(xⁿ⁻¹+axⁿ⁻²+...+aⁿ⁻¹) to cancel (x−a).",
      },
      {
        problem: "Check if f(x) = |x−2| is differentiable at x=2.",
        solution: "f(x) = x−2 for x>2, = 2−x for x<2. LHD at x=2: lim(h→0⁻) f(2+h)−f(2)/h = (2−(2+h)−0)/h = −h/h = −1. RHD = lim(h→0⁺) (2+h−2−0)/h = h/h = 1. LHD ≠ RHD → not differentiable at x=2.",
        keyStep: "For |x−a|: always non-differentiable at x=a. Continuous everywhere.",
      },
      {
        problem: "Verify Rolle's theorem for f(x) = x²−4x+3 on [1,3].",
        solution: "f(1) = 1−4+3 = 0. f(3) = 9−12+3 = 0. f(1)=f(3) ✓. f is polynomial → continuous on [1,3] and differentiable on (1,3) ✓. f'(x) = 2x−4 = 0 → x = 2 ∈ (1,3) ✓. Rolle's theorem verified.",
        keyStep: "Rolle's: f(a)=f(b) → ∃c with f'(c)=0. Find c by setting f'(x)=0.",
      },
    ],
    quickFire: [
      { q: "lim(x→0) sinx/x = ?", a: "1" },
      { q: "Is |x| differentiable at x=0?", a: "No (LHD=−1, RHD=+1)" },
      { q: "lim(x→∞)(1+1/x)^x = ?", a: "e ≈ 2.718" },
      { q: "Every differentiable function is?", a: "Continuous (but not vice versa)" },
      { q: "L'Hôpital applies when limit is of form?", a: "0/0 or ∞/∞" },
    ],
  },
  "calculus-application-of-derivatives": {
    formulas: [
      { name: "Increasing/Decreasing", formula: "f'(x) > 0 → increasing; f'(x) < 0 → decreasing", note: "Find intervals by solving f'(x)=0 for critical points, then test sign of f'(x) in each interval." },
      { name: "Maxima/Minima", formula: "1st test: f'(c)=0; sign change +→− → max, −→+ → min", note: "2nd derivative test: f''(c)<0 → max; f''(c)>0 → min; f''(c)=0 → inconclusive (try 1st test)." },
      { name: "Tangent and Normal", formula: "Slope of tangent = f'(x₀); normal slope = −1/f'(x₀)", note: "Equation of tangent: y−y₀ = m(x−x₀). Normal: y−y₀ = (−1/m)(x−x₀)." },
      { name: "Rate of Change", formula: "dy/dt = (dy/dx)(dx/dt)", note: "Chain rule for related rates. Identify what's changing and what's constant. Draw a diagram." },
    ],
    examples: [
      {
        problem: "Find maxima and minima of f(x) = 2x³ − 3x² − 12x + 4.",
        solution: "f'(x) = 6x²−6x−12 = 6(x²−x−2) = 6(x−2)(x+1). Critical points: x=2 and x=−1. f''(x)=12x−6. f''(2)=18>0 → local min at x=2. f''(−1)=−18<0 → local max at x=−1. f(2)=16−12−24+4=−16. f(−1)=−2−3+12+4=11.",
        keyStep: "Always find both critical points and use 2nd derivative test to classify.",
      },
      {
        problem: "Find equation of tangent to y=x³−3x at point where x=2.",
        solution: "y(2) = 8−6 = 2. Point: (2,2). f'(x) = 3x²−3. Slope at x=2: m = 3(4)−3 = 9. Tangent: y−2 = 9(x−2) → y = 9x−16.",
        keyStep: "Find the point (substitute x), find slope (f'(x₀)), then use point-slope form.",
      },
      {
        problem: "A ladder 5m long leans against a wall. Bottom slides at 0.5 m/s. How fast is top sliding when bottom is 3m from wall?",
        solution: "x²+y²=25. Differentiate: 2x(dx/dt)+2y(dy/dt)=0. At x=3: y=4. 2(3)(0.5)+2(4)(dy/dt)=0 → dy/dt = −3/8 m/s. Top slides down at 3/8 m/s.",
        keyStep: "Implicit differentiation. Write geometric relation first, then differentiate w.r.t. time.",
      },
    ],
    quickFire: [
      { q: "Sign of f''(c) for local maximum?", a: "f''(c) < 0" },
      { q: "Tangent parallel to x-axis means?", a: "f'(x) = 0 at that point" },
      { q: "Slope of normal when slope of tangent = 3?", a: "−1/3" },
      { q: "f(x) = eˣ is always?", a: "Increasing (f'(x)=eˣ>0 always)" },
      { q: "At inflection point?", a: "f''(x) = 0 and sign of f'' changes" },
    ],
  },
  "coordinate-geometry-circles": {
    formulas: [
      { name: "General Form", formula: "x²+y²+2gx+2fy+c=0; centre (−g,−f), r=√(g²+f²−c)", note: "Standard form: (x−h)²+(y−k)²=r². For real circle: g²+f²−c > 0." },
      { name: "Tangent at Point", formula: "xx₁+yy₁=r² (on circle x²+y²=r²)", note: "In general form: xx₁+yy₁+g(x+x₁)+f(y+y₁)+c=0. This is the T=0 result." },
      { name: "Chord of Contact", formula: "Same as tangent formula T=0 from external point", note: "If two tangents from external (x₁,y₁), the chord of contact (joining tangent points) is xx₁+yy₁=r²." },
      { name: "Tangent Length", formula: "L = √(x₁²+y₁²+2gx₁+2fy₁+c) = √S₁", note: "S₁ = value of (x²+y²+2gx+2fy+c) at point (x₁,y₁). If S₁>0, point is outside circle." },
      { name: "Family of Circles", formula: "S₁+λS₂=0", note: "Passes through intersection of S₁=0 and S₂=0. For λ=−1, it's the radical axis (common chord equation: S₁−S₂=0)." },
    ],
    examples: [
      {
        problem: "Find the equation of circle passing through (1,0), (0,1) and having centre on line y=x.",
        solution: "Let circle be x²+y²+2gx+2fy+c=0. Through (1,0): 1+2g+c=0. Through (0,1): 1+2f+c=0. From these: g=f (so centre (−g,−g) lies on y=x ✓). Centre on y=x: −g=−f → g=f ✓. From 1+2g+c=0 and g=f: need one more. Using both points: 2g=2f → c=−1−2g. Need radius condition... Actually using general form and the two points gives g=f=(−1−c)/2. Choose c=−1: g=f=0, circle x²+y²=1 passes through both ✓.",
        keyStep: "Two-point conditions give two equations; constraint on centre gives third.",
      },
      {
        problem: "Find length of tangent from (5,12) to circle x²+y²=169.",
        solution: "S₁ = 5²+12²−169 = 25+144−169 = 0. Length = √S₁ = 0. Point (5,12) is ON the circle (5²+12²=169=13²). Length of tangent = 0 from a point on the circle.",
        keyStep: "S₁=0 means point on circle. S₁>0: outside. S₁<0: inside.",
      },
      {
        problem: "Circles C₁: x²+y²−4x−2y+1=0 and C₂: x²+y²−2x+4y−3=0. Find radical axis.",
        solution: "S₁−S₂ = (−4x−2y+1)−(−2x+4y−3) = −2x−6y+4 = 0 → x+3y−2=0. Radical axis is x+3y=2.",
        keyStep: "Radical axis = S₁−S₂ = 0. It is perpendicular to line joining centres.",
      },
    ],
    quickFire: [
      { q: "Condition for circle x²+y²+2gx+2fy+c=0 to pass through origin?", a: "c = 0" },
      { q: "Tangent from external point: how many tangents?", a: "Two tangents (if point truly external)" },
      { q: "Equation of common chord of two intersecting circles?", a: "S₁ − S₂ = 0" },
      { q: "Centre of x²+y²−6x+4y+3=0?", a: "(3, −2)" },
      { q: "Chord of contact vs tangent at a point?", a: "Chord of contact from external point; tangent at a point on circle — same formula T=0 but different meanings" },
    ],
  },
  "coordinate-geometry-conics": {
    formulas: [
      { name: "Parabola y²=4ax", formula: "Vertex (0,0); focus (a,0); directrix x=−a; LR=4a", note: "Parametric: (at², 2at). Tangent at t: ty = x+at². Normal: tx+y = 2at+at³." },
      { name: "Ellipse x²/a²+y²/b²=1", formula: "c²=a²−b²; e=c/a<1; sum of focal dist=2a", note: "Foci: (±c,0). Directrices: x=±a/e. Latus rectum = 2b²/a. Auxiliary circle: x²+y²=a²." },
      { name: "Hyperbola x²/a²−y²/b²=1", formula: "c²=a²+b²; e=c/a>1; asymptotes y=±(b/a)x", note: "Foci: (±c,0). Difference of focal distances = 2a. Rectangular hyperbola: a=b → asymptotes at 90°." },
      { name: "Tangent to Conic (T=0 method)", formula: "Replace x² by xx₁, y² by yy₁, 2x by x+x₁, 2y by y+y₁", note: "For parabola y²=4ax at (x₁,y₁): yy₁=2a(x+x₁). Slope form: y=mx+a/m (for parabola)." },
    ],
    examples: [
      {
        problem: "Find the focus, vertex, and length of latus rectum of parabola x² = −8y.",
        solution: "x²=−8y has form x²=−4ay. 4a=8 → a=2. Opens downward. Vertex: (0,0). Focus: (0,−a) = (0,−2). Directrix: y=2. Latus rectum = 4a = 8.",
        keyStep: "x²=4ay opens upward; x²=−4ay opens downward. Focus at (0,a) or (0,−a).",
      },
      {
        problem: "For ellipse x²/25+y²/16=1, find eccentricity, foci, and length of major/minor axes.",
        solution: "a²=25→a=5, b²=16→b=4. c=√(25−16)=3. e=c/a=3/5. Foci: (±3,0). Major axis = 2a=10 (along x). Minor axis = 2b=8 (along y).",
        keyStep: "For ellipse: larger denominator under x² or y² determines which axis is major.",
      },
      {
        problem: "Find the tangent to parabola y²=12x with slope 3.",
        solution: "y²=12x → 4a=12 → a=3. Tangent: y=mx+a/m = 3x+3/3 = 3x+1. Verify: from y=3x+1 into y²=12x: (3x+1)²=12x → 9x²+6x+1=12x → 9x²−6x+1=0 → (3x−1)²=0 ✓ (tangent touches at one point).",
        keyStep: "Slope form of tangent to y²=4ax: y=mx+a/m. This always works regardless of point of tangency.",
      },
    ],
    quickFire: [
      { q: "Eccentricity of parabola?", a: "e = 1 (always)" },
      { q: "Asymptotes of rectangular hyperbola xy = c²?", a: "The x and y axes (perpendicular asymptotes)" },
      { q: "Sum of focal distances for ellipse?", a: "2a (constant for all points on ellipse)" },
      { q: "Directrix of parabola y²=4ax?", a: "x = −a" },
      { q: "Difference of focal distances for hyperbola?", a: "2a (constant)" },
    ],
  },
  "matrices-and-determinants": {
    formulas: [
      { name: "Determinant (2×2)", formula: "|a b; c d| = ad − bc", note: "For 3×3, expand along any row/column (choose row/column with most zeros to simplify)." },
      { name: "Determinant Properties", formula: "Row ops: swap → −det; multiply row by k → k·det; R_i+kR_j → det unchanged", note: "Two identical rows → det=0. Row of zeros → det=0. Diagonal matrix: det = product of diagonal elements." },
      { name: "Matrix Inverse", formula: "A⁻¹ = adj(A)/|A|; (AB)⁻¹ = B⁻¹A⁻¹", note: "adj(A) = transpose of cofactor matrix. A exists only if |A|≠0. A·A⁻¹ = I." },
      { name: "Cramer's Rule", formula: "x_i = D_i/D; D = |A|; D_i replaces i-th column with b", note: "Unique solution when D≠0. If D=0 and any D_i≠0: no solution. If D=0 and all D_i=0: infinite solutions." },
    ],
    examples: [
      {
        problem: "Evaluate det[[1,2,3],[4,5,6],[7,8,9]].",
        solution: "Expanding: 1(5×9−6×8)−2(4×9−6×7)+3(4×8−5×7) = 1(45−48)−2(36−42)+3(32−35) = −3+12−9 = 0. Determinant = 0 (rows in AP → linearly dependent).",
        keyStep: "If rows/columns are linearly dependent (one is linear combination of others), det = 0.",
      },
      {
        problem: "Find A⁻¹ for A = [[2,1],[5,3]].",
        solution: "|A| = 2×3−1×5 = 1. adj(A) = [[3,−1],[−5,2]] (swap diagonal, negate off-diagonal for 2×2). A⁻¹ = adj(A)/|A| = [[3,−1],[−5,2]].",
        keyStep: "For 2×2: swap diagonal elements, negate off-diagonal → adjugate. Then divide by |A|.",
      },
      {
        problem: "Solve using Cramer's rule: x+y=3, 2x−y=0.",
        solution: "D = |1 1; 2 −1| = −1−2 = −3. D_x = |3 1; 0 −1| = −3−0 = −3. D_y = |1 3; 2 0| = 0−6 = −6. x = D_x/D = −3/(−3) = 1. y = D_y/D = −6/(−3) = 2. Solution: (1,2).",
        keyStep: "Replace the column of the variable with the constants column to get D_x, D_y.",
      },
    ],
    quickFire: [
      { q: "det(AB) = ?", a: "det(A) × det(B)" },
      { q: "If |A| = 0, is A invertible?", a: "No (singular matrix)" },
      { q: "For skew-symmetric matrix, diagonal elements = ?", a: "Zero (since aᵢᵢ = −aᵢᵢ → aᵢᵢ = 0)" },
      { q: "Order of AB where A is m×n and B is n×p?", a: "m×p" },
      { q: "det of identity matrix Iₙ = ?", a: "1" },
    ],
  },
  "probability": {
    formulas: [
      { name: "Classical Probability", formula: "P(A) = n(A)/n(S)", note: "n(S) = total equally likely outcomes. For counting: permutations (order matters) vs combinations (order irrelevant)." },
      { name: "Conditional Probability", formula: "P(A|B) = P(A∩B)/P(B)", note: "P(A∩B) = P(A)P(B) if independent. P(A∪B) = P(A)+P(B)−P(A∩B)." },
      { name: "Bayes' Theorem", formula: "P(Aᵢ|B) = P(B|Aᵢ)P(Aᵢ) / ΣP(B|Aⱼ)P(Aⱼ)", note: "Draw tree diagram. Find P(B) using total probability in denominator. Very systematic approach." },
      { name: "Binomial Distribution", formula: "P(X=r) = ⁿCᵣ pʳ (1−p)ⁿ⁻ʳ; mean=np; var=npq", note: "n = trials, p = success probability, q = 1−p. Most probable value ≈ floor((n+1)p)." },
    ],
    examples: [
      {
        problem: "Bag A: 4 red, 2 blue. Bag B: 2 red, 3 blue. A bag is chosen randomly, then a ball. It's red. Find P(from bag A).",
        solution: "P(A)=P(B)=0.5. P(Red|A)=4/6=2/3. P(Red|B)=2/5. P(Red) = 0.5×2/3+0.5×2/5 = 1/3+1/5 = 8/15. P(A|Red) = (2/3×1/2)/(8/15) = (1/3)/(8/15) = (1/3)×(15/8) = 5/8.",
        keyStep: "Bayes: P(cause|effect) = P(effect|cause)×P(cause)/P(effect). Use total probability for denominator.",
      },
      {
        problem: "P(X=r) for binomial n=5, p=0.6. Find P(X=3).",
        solution: "P(X=3) = C(5,3)(0.6)³(0.4)² = 10×0.216×0.16 = 10×0.03456 = 0.3456.",
        keyStep: "Calculate ⁿCᵣ first, then multiply by pʳ × qⁿ⁻ʳ. Double check r and n−r.",
      },
      {
        problem: "Cards drawn without replacement from 52. P(both kings | 2 drawn)?",
        solution: "P(K₁) = 4/52. P(K₂|K₁) = 3/51 (3 kings left in 51 cards). P(both kings) = (4/52)×(3/51) = 12/2652 = 1/221.",
        keyStep: "Without replacement: conditional probability. After drawing one card, pool reduces.",
      },
    ],
    quickFire: [
      { q: "P(A) + P(A') = ?", a: "1 (complementary events)" },
      { q: "Variance of Binomial distribution?", a: "npq = np(1−p)" },
      { q: "If A and B mutually exclusive, P(A∩B) = ?", a: "0" },
      { q: "P(A∪B) when A and B independent?", a: "P(A)+P(B)−P(A)P(B)" },
      { q: "Mean of binomial distribution?", a: "np" },
    ],
  },
  "sequences-series-and-complex-numbers": {
    formulas: [
      { name: "AP Formulas", formula: "a_n = a+(n−1)d; S_n = n/2[2a+(n−1)d] = n(a+l)/2", note: "d = common difference. l = last term. Arithmetic mean of a and b: (a+b)/2." },
      { name: "GP Formulas", formula: "a_n = arⁿ⁻¹; S_n = a(rⁿ−1)/(r−1); S_∞ = a/(1−r) for |r|<1", note: "Geometric mean of a and b: √(ab). For |r|<1, infinite GP converges." },
      { name: "AM-GM-HM Inequality", formula: "AM ≥ GM ≥ HM; equality when all terms equal", note: "Use to find min/max. If a+b=constant, ab maximised when a=b. If ab=constant, a+b minimised when a=b." },
      { name: "Complex Numbers", formula: "|z| = √(a²+b²); z̄ = a−bi; arg z = tan⁻¹(b/a)", note: "z·z̄ = |z|². |z₁z₂| = |z₁||z₂|. arg(z₁z₂) = arg z₁ + arg z₂. De Moivre: (cosθ+i sinθ)ⁿ = cos nθ + i sin nθ." },
    ],
    examples: [
      {
        problem: "An AP has first term 3, last term 83, sum = 903. Find n and common difference d.",
        solution: "S = n(a+l)/2 → 903 = n(3+83)/2 = 43n → n = 21. d = (l−a)/(n−1) = (83−3)/20 = 80/20 = 4.",
        keyStep: "S = n(a+l)/2 when last term is known. Then d = (l−a)/(n−1).",
      },
      {
        problem: "Find |z| and arg(z) for z = 1+i√3.",
        solution: "|z| = √(1+3) = 2. arg(z) = tan⁻¹(√3/1) = π/3 (in first quadrant). Polar form: z = 2(cos π/3 + i sin π/3).",
        keyStep: "Modulus = √(real²+imaginary²). Argument = angle from positive real axis (check quadrant!).",
      },
      {
        problem: "Using AM-GM, find minimum value of 4x + 9/x for x>0.",
        solution: "AM-GM: (4x + 9/x)/2 ≥ √(4x × 9/x) = √36 = 6. So 4x + 9/x ≥ 12. Equality when 4x = 9/x → 4x² = 9 → x = 3/2.",
        keyStep: "Apply AM-GM: (a+b)/2 ≥ √(ab). Product of the two terms = 4x × 9/x = 36 (constant!). Min = 2√36 = 12.",
      },
    ],
    quickFire: [
      { q: "Sum of infinite GP with a=1, r=1/2?", a: "S = a/(1−r) = 1/(1/2) = 2" },
      { q: "Σn from 1 to 100 = ?", a: "100×101/2 = 5050" },
      { q: "Cube roots of unity: 1 + ω + ω² = ?", a: "0" },
      { q: "HM of a and b?", a: "2ab/(a+b)" },
      { q: "De Moivre: (cos θ + i sin θ)⁻¹ = ?", a: "cos θ − i sin θ = cos(−θ) + i sin(−θ)" },
    ],
  },
};
