// ================================================================
//  CE210T: Application of ICT — Lecture 3 Quiz Questions
//  Based on Slides 1–18: CPU, Components, RAM, ROM, Machine Cycle
//  Total: 30 questions across 6 topics
// ================================================================

export const ALL_QUESTIONS = [

  // ── TOPIC 1: CPU Introduction & Overview (Slides 3–4) ──────────
  {
    id: 1, topic: "CPU Overview",
    question: "Which of the following is NOT listed as a function of the CPU?",
    options: [
      "Fetching instructions from memory",
      "Displaying output on the screen directly",
      "Decoding instructions to determine required operations",
      "Storing output back into memory"
    ],
    answer: "Displaying output on the screen directly",
    explanation: "The CPU fetches, decodes, executes, and stores. Display output goes through I/O devices — the CPU doesn't control the screen directly."
  },
  {
    id: 2, topic: "CPU Overview",
    question: "The CPU operates at extremely high speeds — meaning how many instruction cycles per second?",
    options: ["Millions", "Thousands", "Billions", "Trillions"],
    answer: "Billions",
    explanation: "Modern CPUs perform billions of instruction cycles per second, measured in GHz (gigahertz)."
  },
  {
    id: 3, topic: "CPU Overview",
    question: "Which CPU component directs and coordinates all CPU activities?",
    options: ["ALU", "Cache Memory", "Control Unit (CU)", "Bus Interface Unit (BIU)"],
    answer: "Control Unit (CU)",
    explanation: "The Control Unit acts as the 'brain within the brain' — it directs how data moves within the CPU and ensures all components work in synchronization."
  },
  {
    id: 4, topic: "CPU Overview",
    question: "Which component manages data flow between the CPU, memory, and I/O devices?",
    options: ["ALU", "Registers", "Cache Memory", "Bus Interface Unit (BIU)"],
    answer: "Bus Interface Unit (BIU)",
    explanation: "The BIU acts as a communication bridge between CPU components and the rest of the system."
  },
  {
    id: 5, topic: "CPU Overview",
    question: "What is the purpose of Prefetch & Decode Units in modern CPUs?",
    options: [
      "To store permanent firmware",
      "To increase execution efficiency by fetching and interpreting instructions in advance",
      "To perform floating-point calculations",
      "To manage L1, L2, and L3 cache levels"
    ],
    answer: "To increase execution efficiency by fetching and interpreting instructions in advance",
    explanation: "Prefetch & Decode Units are used in modern CPUs to increase execution efficiency by predicting and preparing upcoming instructions."
  },

  // ── TOPIC 2: ALU & FPU (Slides 6–7) ───────────────────────────
  {
    id: 6, topic: "ALU & FPU",
    question: "The ALU performs which two main categories of operations?",
    options: [
      "Arithmetic and Logical",
      "Fetch and Store",
      "Input and Output",
      "Encode and Decode"
    ],
    answer: "Arithmetic and Logical",
    explanation: "The ALU (Arithmetic Logic Unit) performs Arithmetic Operations (add, subtract, multiply, divide) and Logical Operations (AND, OR, NOT, XOR)."
  },
  {
    id: 7, topic: "ALU & FPU",
    question: "Which of the following is a logical operation performed by the ALU?",
    options: ["Multiplication", "Division", "XOR", "Square root"],
    answer: "XOR",
    explanation: "XOR is a logical operation. Multiplication and division are arithmetic. Square root is handled by the FPU."
  },
  {
    id: 8, topic: "ALU & FPU",
    question: "When the ALU adds two numbers, what does it do first?",
    options: [
      "Sends the numbers to RAM",
      "Converts them to binary, then adds bit by bit",
      "Passes them to the FPU for processing",
      "Stores them in the Instruction Register"
    ],
    answer: "Converts them to binary, then adds bit by bit",
    explanation: "When adding two numbers, the ALU converts them to binary, adds bit by bit, and stores the result instantly."
  },
  {
    id: 9, topic: "ALU & FPU",
    question: "What is the main difference between the ALU and the FPU?",
    options: [
      "The ALU handles logical operations; the FPU handles arithmetic",
      "The ALU is optimized for integers; the FPU handles decimal/fractional numbers",
      "The FPU is faster than the ALU",
      "The ALU is inside the CPU; the FPU is outside"
    ],
    answer: "The ALU is optimized for integers; the FPU handles decimal/fractional numbers",
    explanation: "The ALU handles integer arithmetic and logic; the FPU (Floating Point Unit) specializes in decimal/fractional numbers required for scientific and graphics computations."
  },
  {
    id: 10, topic: "ALU & FPU",
    question: "Why is the FPU particularly important for AI and Machine Learning?",
    options: [
      "AI needs integer calculations exclusively",
      "AI computations involve weights, biases, and probabilities — all non-integer real numbers",
      "The FPU manages memory allocation for AI models",
      "AI uses logical operations that only the FPU supports"
    ],
    answer: "AI computations involve weights, biases, and probabilities — all non-integer real numbers",
    explanation: "In AI and ML, computations involve weights, biases, probabilities, and activation values — all non-integer, real numbers that require the FPU."
  },

  // ── TOPIC 3: Control Unit & Registers (Slides 8–9) ────────────
  {
    id: 11, topic: "Control Unit & Registers",
    question: "The Control Unit is described as the 'brain within the brain'. What does this mean?",
    options: [
      "It is a separate CPU outside the main processor",
      "It directs all other CPU components and coordinates the fetch-decode-execute cycle",
      "It performs the most complex calculations",
      "It stores all data temporarily during execution"
    ],
    answer: "It directs all other CPU components and coordinates the fetch-decode-execute cycle",
    explanation: "The CU acts as the 'brain within the brain' — it directs how data moves within the CPU and ensures all components work in synchronization."
  },
  {
    id: 12, topic: "Control Unit & Registers",
    question: "Which register holds the address of the NEXT instruction to be executed?",
    options: ["ACC (Accumulator)", "IR (Instruction Register)", "PC (Program Counter)", "MDR (Memory Data Register)"],
    answer: "PC (Program Counter)",
    explanation: "The Program Counter (PC) contains the address of the next instruction to be fetched and executed."
  },
  {
    id: 13, topic: "Control Unit & Registers",
    question: "The Accumulator (ACC) register is used to:",
    options: [
      "Store the address of data in memory",
      "Hold the instruction currently being executed",
      "Temporarily hold results of ALU operations",
      "Carry data between the CPU and RAM"
    ],
    answer: "Temporarily hold results of ALU operations",
    explanation: "The ACC (Accumulator) temporarily holds results of ALU operations before they are stored or used further."
  },
  {
    id: 14, topic: "Control Unit & Registers",
    question: "What is stored in the MAR (Memory Address Register)?",
    options: [
      "The instruction currently being executed",
      "The result of the last ALU operation",
      "The address of data in memory",
      "Data fetched from or written to memory"
    ],
    answer: "The address of data in memory",
    explanation: "The MAR (Memory Address Register) stores the address of the memory location being accessed."
  },
  {
    id: 15, topic: "Control Unit & Registers",
    question: "Why do registers improve CPU performance?",
    options: [
      "They provide more storage than RAM",
      "They are located inside the CPU and reduce data access time",
      "They permanently store frequently used programs",
      "They communicate directly with I/O devices"
    ],
    answer: "They are located inside the CPU and reduce data access time",
    explanation: "Registers are small, ultra-fast storage units directly inside the CPU. Their proximity reduces data access time, directly improving CPU speed and efficiency."
  },

  // ── TOPIC 4: Cache Memory, BIU & Prefetch (Slides 10–12) ──────
  {
    id: 16, topic: "Cache & BIU",
    question: "When the CPU looks for data in cache and finds it, this is called a:",
    options: ["Cache miss", "Cache flush", "Cache hit", "Cache write"],
    answer: "Cache hit",
    explanation: "A cache hit occurs when the CPU finds the required data in cache. A cache miss means the data wasn't there and must be fetched from slower RAM."
  },
  {
    id: 17, topic: "Cache & BIU",
    question: "Which cache level is the FASTEST and located inside each CPU core?",
    options: ["L3 Cache", "L2 Cache", "L1 Cache", "RAM"],
    answer: "L1 Cache",
    explanation: "L1 Cache is the fastest and smallest, located inside each core. L2 is larger but slightly slower, and L3 is the largest and shared across all cores."
  },
  {
    id: 18, topic: "Cache & BIU",
    question: "The Address Bus is responsible for:",
    options: [
      "Carrying actual data between CPU and memory",
      "Sending read/write and interrupt signals",
      "Carrying memory addresses",
      "Managing cache hit and miss operations"
    ],
    answer: "Carrying memory addresses",
    explanation: "The Address Bus carries memory addresses. The Data Bus carries actual data, and the Control Bus sends read/write and interrupt signals."
  },
  {
    id: 19, topic: "Cache & BIU",
    question: "Instruction prefetching in the BIU helps because:",
    options: [
      "It permanently stores instructions for reuse",
      "It fetches upcoming instructions while current ones are executing, improving throughput",
      "It decodes instructions before they reach the CPU",
      "It prevents cache misses by storing all data in L1"
    ],
    answer: "It fetches upcoming instructions while current ones are executing, improving throughput",
    explanation: "The BIU handles instruction prefetching — fetching upcoming instructions while current ones are executing, improving overall throughput."
  },
  {
    id: 20, topic: "Cache & BIU",
    question: "What does the Decode Unit do with instructions received from the Prefetch Unit?",
    options: [
      "Stores them permanently in ROM",
      "Converts them into binary for RAM storage",
      "Interprets and converts them into a format understood by the CU, ALU, and FPU",
      "Sends them directly to I/O devices"
    ],
    answer: "Interprets and converts them into a format understood by the CU, ALU, and FPU",
    explanation: "The Decode Unit interprets fetched instructions and converts them into a format understood by the Control Unit, ALU, and FPU before sending them for execution."
  },

  // ── TOPIC 5: System Clock, RAM & ROM (Slides 13–16) ───────────
  {
    id: 21, topic: "Clock, RAM & ROM",
    question: "A CPU with a clock speed of 3.0 GHz performs how many clock cycles per second?",
    options: ["3 million", "3 thousand", "3 billion", "3 trillion"],
    answer: "3 billion",
    explanation: "GHz means gigahertz = billions of cycles per second. A 3.0 GHz CPU performs 3 billion clock cycles every second."
  },
  {
    id: 22, topic: "Clock, RAM & ROM",
    question: "Each clock pulse triggers part of which cycle?",
    options: [
      "The boot cycle",
      "The machine cycle (fetch, decode, execute, store)",
      "The memory refresh cycle",
      "The I/O interrupt cycle"
    ],
    answer: "The machine cycle (fetch, decode, execute, store)",
    explanation: "Each clock pulse triggers part of the machine cycle — fetch, decode, execute, store. The system clock synchronizes all CPU operations."
  },
  {
    id: 23, topic: "Clock, RAM & ROM",
    question: "RAM is described as 'volatile'. What does this mean?",
    options: [
      "It stores data permanently even when powered off",
      "It is extremely fast and located inside the CPU",
      "All data in RAM is erased when the computer is powered off",
      "It can only be read, not written to"
    ],
    answer: "All data in RAM is erased when the computer is powered off",
    explanation: "RAM is volatile memory — it holds data only while the computer is powered on. When power is turned off, all data in RAM is erased."
  },
  {
    id: 24, topic: "Clock, RAM & ROM",
    question: "When you open a program on your computer, what happens according to the RAM working principle?",
    options: [
      "The program runs directly from the SSD/HDD",
      "The program's data and instructions are loaded from storage into RAM",
      "The program is copied into ROM for execution",
      "The CPU fetches the program directly from the internet"
    ],
    answer: "The program's data and instructions are loaded from storage into RAM",
    explanation: "When you open a program, its data and instructions are loaded from storage (SSD/HDD) into RAM so the CPU can access them quickly."
  },
  {
    id: 25, topic: "Clock, RAM & ROM",
    question: "ROM contains BIOS or UEFI. What is the role of BIOS/UEFI at startup?",
    options: [
      "It loads all user applications into RAM",
      "It checks hardware (RAM, keyboard, display) and starts the operating system",
      "It increases the CPU clock speed",
      "It manages the L1 and L2 cache during boot"
    ],
    answer: "It checks hardware (RAM, keyboard, display) and starts the operating system",
    explanation: "ROM contains BIOS/UEFI, which checks the hardware (RAM, keyboard, display) and starts the operating system during the boot process."
  },
  {
    id: 26, topic: "Clock, RAM & ROM",
    question: "Which of the following correctly contrasts RAM and ROM?",
    options: [
      "RAM is non-volatile; ROM is volatile",
      "RAM stores firmware; ROM stores user data",
      "RAM is volatile and temporary; ROM is non-volatile and permanent",
      "Both RAM and ROM lose data when power is off"
    ],
    answer: "RAM is volatile and temporary; ROM is non-volatile and permanent",
    explanation: "RAM is volatile — data is lost on power off. ROM is non-volatile — it permanently stores firmware like BIOS and retains data without power."
  },

  // ── TOPIC 6: Machine Cycle (Slides 17–18) ─────────────────────
  {
    id: 27, topic: "Machine Cycle",
    question: "What is the correct order of the four stages in the Machine Cycle?",
    options: [
      "Decode → Fetch → Store → Execute",
      "Fetch → Decode → Execute → Store",
      "Execute → Fetch → Decode → Store",
      "Fetch → Execute → Decode → Store"
    ],
    answer: "Fetch → Decode → Execute → Store",
    explanation: "The Machine Cycle has four stages in order: Fetch (retrieve instruction from memory), Decode (interpret the instruction), Execute (carry out the operation), Store (write result back)."
  },
  {
    id: 28, topic: "Machine Cycle",
    question: "During the FETCH stage, the address of the next instruction comes from which register?",
    options: ["IR (Instruction Register)", "MDR (Memory Data Register)", "ACC (Accumulator)", "PC (Program Counter)"],
    answer: "PC (Program Counter)",
    explanation: "In the Fetch stage: PC holds the address → copied to MAR → address sent via Address Bus → instruction fetched into MDR → copy placed in IR → PC incremented by 1."
  },
  {
    id: 29, topic: "Machine Cycle",
    question: "After a CPU processes the command '2 + 3', in which stage is the result of adding registers X and Y stored in register Z?",
    options: ["Fetch", "Decode", "Execute", "Store"],
    answer: "Execute",
    explanation: "During the Execute stage, the ALU performs the specified operation — in this case, adding registers X and Y and storing the result in register Z."
  },
  {
    id: 30, topic: "Machine Cycle",
    question: "An instruction is split into Opcode and Operand during which stage?",
    options: ["Fetch", "Decode", "Execute", "Store"],
    answer: "Decode",
    explanation: "During the Decode stage, the fetched instruction is split into: Opcode (what operation to perform) and Operand (the data or address of the data)."
  },
];
