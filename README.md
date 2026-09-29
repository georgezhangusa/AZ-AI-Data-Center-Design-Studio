# AZ AI Data Center Design Studio

Engineered an interactive software for AI data center design that converts workload requirements into preliminary facility plans. Users configure GPUs, racks, substations, switchgear, 800V DC power, batteries, generators, cooling, and redundancy. It calculates capacity, PUE, costs, footprint, water use, and schedule, then generates engineering, financial, visualization, and proposal deliverable packages.

The AI data center design and configuration go through **three** stages:

**1. Workload ingress and sizing**
   - Select accelerator architecture, rack density, GPU count, and deployment region.
   - The system calculates estimated racks, critical IT load, white-space area, and coolant flow.

**2. Component engineering**
   - Configure substations, GIS/AIS yards, transformers, 800V DC or 480V AC distribution, generators, batteries, cooling systems, redundancy, and building structure.
   - Continuously show engineering, cost, capacity, PUE, water usage, footprint, lead time, and projected COD metrics.

**3. Deliverables and ROI**
   - Generate or view aerial campus plans, electrical single-lines, mechanical P&IDs, ROI/TCO, BOMs, ESG analysis, 3D isometrics, site layouts, and thermal views.
   - Export a pitch pack, or push the design to CRM/estimating and EPC workflows.
---

## Conceptual Demonstration & Collaboration

This is a conceptual demonstration. If you think it could become a useful application, we can collaborate to make it happen. Please get in touch with the author, **George Zhang**:

- **Email:** [z_george@yahoo.com](mailto:z_george@yahoo.com)
- **LinkedIn:** [georgezhangusa](https://www.linkedin.com/in/georgezhangusa/)

---

## Key Capabilities

### 1. Workload Ingress & Compute Sizing
- **Top-Down Workload Mode:** Sizing by GPU targets (NVIDIA GB200 NVL72, H100/H200, B200) with cluster-level compute density calculations.
- **Bottom-Up Power Mode:** Capping design based on utility interconnection limits (e.g. 50 MW, 100 MW, 300 MW) and back-calculating maximum possible accelerator deployments.
- **Rack Density Engine:** Real-time physical spacing and thermal dissipation modeling across 40 kW/rack up to 140 kW/rack.

### 2. Electrical Subsystems & Behind-The-Meter (BTM) Power
- **Utility Ingress:** Air-Insulated Switchgear (AIS), Gas-Insulated Substation (GIS), and Compact Modular Skids.
- **High-Voltage Transformers:** Traditional oil/dry transformers vs. Solid-State Transformers (SST) with multi-port DC integration.
- **Power Distribution Architecture:** 800V DC busway systems vs. high-efficiency 415V AC distribution.
- **BTM Generation & Storage:** Aeroderivative gas turbines, natural gas recip engines, small modular reactors (SMR), and LFP BESS battery energy storage.

### 3. Thermal Physics & Liquid Cooling
- **Liquid Cooling Topologies:** Direct-to-Chip (D2C) Liquid-to-Liquid (L2L) with secondary CDU loops, Liquid-to-Air (L2A), and Single-Phase Immersion.
- **Heat Rejection Plants:** Adiabatic dry coolers, closed-circuit cooling towers, and air-cooled chillers.
- **Environmental Efficiency:** Real-time dynamic PUE (Power Usage Effectiveness) and WUE (Water Usage Effectiveness) calculation by climate region.

### 4. Civil, Structural & Redundancy Engineering
- **Envelope Configurations:** Stick-built steel/concrete vs. modular prefabricated containerized structures.
- **Reliability Tiers:** N baseline, N+1 resilient, and 2N concurrent maintainability topologies.
- **Footprint Analysis:** Real-time computing of IT white space, electrical yards, mechanical equipment footprint, and site acreage sizing.

### 5. Automated FEED Deliverables & EPC Push
- **Interactive Single-Line Diagram (SLD):** Full medium-voltage to rack-level electrical distribution topology.
- **Process Flow Diagram (PFD):** Primary, secondary, and tertiary cooling hydraulic loop schematics.
- **TCO & Financial Engine:** Detailed CapEx breakdown ($/kW, substation, BESS, cooling, structural) and 10-year OpEx cash flow modeling.
- **1-Click Export:** Pitch pack slide deck and print-ready formal FEED design specification report.
- **EPC Pipeline Integration:** Direct handoff to EPC contractor estimating workbenches.

---

## Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Icons & Graphics:** Lucide React, Custom SVG Engineering Schematics
- **Build Tool:** Vite

---

## Author

**George Zhang**  
- Email: [z_george@yahoo.com](mailto:z_george@yahoo.com)  
- LinkedIn: [linkedin.com/in/georgezhangusa](https://www.linkedin.com/in/georgezhangusa/)
