# GrantVisor

Grant Visor simplifies grant management, allowing DAOs to collaborate seamlessly, allocate funds efficiently, and pursue their goals with confidence. The dapp addresses the challenge of validating completed milestones by grantees, ensures transparency in the distribution of grant payments, and automates payment processes for DAOs through a validated system powered by attestations.

Find a walk through video (here)[https://www.loom.com/share/4e543d4e885546b7bf6ead0b50fbc2d9?sid=b535d77a-1895-4125-a4d4-808078989be0]

- [Get the project running](#how-to-get-this-project-running)
- [What is Grant Visor](#what-is-grantvisor)
- [User Flow](#userflow)
- [How it's made](#how-its-made)

## how to get this project running

naviagte into the react project

```
cd packages/react-app
```

install all dependencies

```
yarn
```

add your **Walletconnect ID** into an `.env` file

run the project

```
yarn run dev
```

## What is GrantVisor

By harnessing the capabilities of attestations, Grant Visor streamlines the entire process. It empowers program managers to establish verified records, monitor milestones, facilitate approvals, and automate fund distribution on the blockchain. Our user-friendly platform acts as a bridge between program managers and grant recipients, enhancing transparency, fostering accountability, and optimizing resource allocation within DAOs.

We facilitate grant payments in the sense, that the whole grant needs to be only approved once by the whole grant committee, in that process a delegate is selected. That person will be in charge of approving the milestones, can then trigger the payments independently. This is especially interesting for grants that are payed out monthly over a longer timeframe. Of course if the timeframe would be too long, there should be check-in points, where the whole committee needs to approve the continuation of the grant payment.

We also added automatic creation of a multisig wallet for the grantees to receive the grant too, to facilitate the grant set up process (e.g. asking the grantees to set one up and send you the address)

As Attestations are happening on-chain and public, this also contributes to solving the issue of transparency to see what projects/ people have received / are currently receiving grants.

Another use-case of our application would be that it serves as a Grant Explorer. Grant Manager can access the Grantees grant history to see what grants they have worked on (aggregated from different chains), if they managed to submit them in time, and if they have been completed. And DAO members can see how Grant Manager handle the funds that they are responsible for.

## UserFlow

The Grant Manager of a project will create the Grant Attestation on our platform. After they receive the GrantUID and created multisigaddress, they will open the our GrantModule in the Zodiac app of the Safe Multisg of the Grant Committee.
They will set up the Grant with amount, milestones and a delegate (in that case the Grant Manager for that specific project). After they have approved it, the Grant Manager will be able to approve Milestones (that the Grantee has created on our page) out of our dApp and trigger payments to the recipient.

grantee: 0x99B551F0Bb2e634D726d62Bb2FF159a34964976C

Grant Manager: 0x78344979959C9d25Beb73748269A2B5533F87a51

1. So first we created our Grant Schema on Base - it exists (User wont have to do anything): https://base-goerli.easscan.org/schema/view/0x40f3d426f8aef71e7426b6bdd8b858f865e716cfb8d0a1b32df80056079e49dc
2. We create the Milestone Schema: https://base-goerli.easscan.org/schema/view/0x83f0b577c98f5eca3ba23e3ee5628d0062d910614c34f118956e15ddb13641c1

Userflow 2. The Grant Manager creates the Grant Attestation in our application: https://base-goerli.easscan.org/attestation/view/0x8c0b93352e1b350c85afda334d4425e65513e0e7333fa9981ed2de97fbe3996b 3. They deploy the PaymentGrantModule on Base in their Multisig: https://goerli.basescan.org/address/0x1c666c332258644e2f2ea53941ae19b7905a5e5 4. They call the `setGrant` function in the Module: https://goerli.basescan.org/tx/0xcd797e6b1a21c6738af0312e5b3b01c4a04b5fbc7c8b04006434f22f324576e5 5. The grantee creates a Milestone attestation: https://base-goerli.easscan.org/attestation/view/0xac3f77cda1b5b47de30f03e15cfc46188cc10e213c8c1746d488d2d78076cef9 7. The Grant Manager will be able to approve it as they have been set as delegate in our Module and can trigger the payment without the other Grant Committee call the `UpdateGrant` function of our Smart Contract - https://goerli.basescan.org/tx/0xaab1f5a2cde6eb4e01e28c5456173fa250bdaf5f9448bf7332c8e92fb6b9db0b 8. we go back to our app and will see that the current status of our grant has been updated and is reflecting the payment (subgraph The Graph and EAS Graph data)

## How it's made

Grant Visor is deployed on BaseGoerli and OptimismGoerli utilizing the Ethereum Attestation Service (EAS) SDK to create proofs for Grants and related Milestones. It servers as a solutions for transparency and accountability in DAO grants.

Our core smart contract is a Safe module, enabling program managers to facilitate grant payments by delegating and automating fund distribution to grantees form their Safe Multisig Wallet.

Grants are created as on-chain, non-revocable attestations.

Grantees can transparently update their progress by submitting milestone (as on-chain, non-revocable attestations) updates as EAS Attestations that they link to the grant attestation to ensure accuracy and transparency.

Except the GrantPayment Creation, the whole process is seamlessly connected through an intuitive user interface that fosters effortless interaction between program managers and grantees.

We are created a Subgraph to query all data related to the grant payment, as well as the EAS GraphQL API to get all data related to grants to create a grant explorer, that will contribute to efficient and transparent grant management.
