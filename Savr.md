**Project Name:** Savr  

**Team Members:**  
- Furkan Nabi Sumji (@furkannabisumji.lens)  
- Chukwunonso Ikeji (@codypharm.lens)  

**Project Description:**  
Savr is a decentralized **Rotating Savings and Credit Association (ROSCA)** platform designed to streamline group savings through blockchain technology. It employs smart contracts for group creation, contributions, and distributions while earning yield via Aave. The project utilizes Chainlink CCIP for interchain messaging. For now, random recipient selection in each cycle is managed using AWS backend services, but this will be replaced with Chainlink VRF once it becomes available on the Lens chain.  

**Source Code Link:** [GitHub Repository](https://github.com/furkannabisumji/savr)

**Preview Link:**  [Link](https://savr-lens.vercel.app/)

**Demo Video/Slide Deck Link:**  [Video](https://www.youtube.com/watch?v=SPcrl6YH0oQ)

**Screenshots:**  
![Screenshot 2025-01-07 090302](https://github.com/user-attachments/assets/2a55b97f-ede2-4631-bd20-205236fe1034)
![Screenshot 2025-01-07 090439](https://github.com/user-attachments/assets/04881be6-ef32-42f3-81f9-9569cff0179d)


---

### **System Design Overview**  

Savr operates with two main smart contracts:  

1. **Savr.sol** (Deployed on the Lens Chain):  
   - Used for creating and managing ROSCA groups.  
   - Facilitates group setup, contribution settings, and member invitations.  

2. **SavrPool.sol** (Deployed on Ethereum Sepolia):  
   - Manages contributions and deposits them into Aave to generate yield.  
   - Handles fund disbursements to members based on group cycles.  

---

### **User Workflow**  

1. **Group Creation:**  
   - A user creates a ROSCA group via **Savr.sol**.  
   - Sets the contribution amount and invites members.  

2. **Contribution Phase:**  
   - Members supply the contribution amount to **SavrPool.sol**, which deposits the funds into Aave.  
   - A message is sent via Chainlink CCIP to **Savr.sol** confirming the contribution.  

3. **Disbursement:**  
   - Once all members contribute, **Savr.sol** sends a message to **SavrPool.sol** to disburse the pooled amount to a member selected randomly.  
   - Currently, random selection is performed using AWS backend services. Once Chainlink VRF becomes available on the Lens chain, it will replace AWS for secure and decentralized randomness.  

4. **Completion and Termination:**  
   - When all cycles are complete, the group is terminated.  
   - **SavrPool.sol** distributes the accrued interest to one random member of the group.  

[Tweet](https://x.com/furkannabisumji/status/1876474036135637034?t=1FDnBZVw-fExq464hrzTVA&s=19)
