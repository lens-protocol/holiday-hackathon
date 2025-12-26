<!-- Submit Your Project
Project Name:
Team Members: (Name and Lens Handle)
Project Description:
Source Code Link:
Preview Link (Optional):
Demo Video/Slide Deck Link (Optional):
Screenshots (Optional):
-->

# Project Name

Frencurve

## Team Members

- erhant

## Project Description

Every account in EVM has an address, derived from a public key, derived from a private key. Public key is simply a coordinate on an "[elliptic-curve](https://www.rareskills.io/post/elliptic-curves-finite-fields)", so basically it is a point $(x, y) \in \mathbb{F}_p^2$ for some large prime $p$ such that it satisfies the following curve equation of [`secp256k1`](https://en.bitcoin.it/wiki/Secp256k1):

$$
y^2 = x^3 + 7
$$

Since these are points, they have some distance between them as well! With that, we define "being close to each other" on the elliptic curve to mean that you two are "curve frens"!

This project implements the required contract & frontend to implement friendship over elliptic-curves, which may pave new friendship dynamics built upon cryptography.

- [Contract on Testnet](https://block-explorer.testnet.lens.dev/address/0x4D9058C198c1c9433612F6dA4f271Ee7D7eB0459#contract)
- [Jokerace Entry](https://jokerace.io/contest/polygon/0x552bdf3d0acfa0bc398607fd675d3b4cce6aabdf/submission/70592271744613817044400087847213095324107207545920898777206167711444430925570)

## Source Code Link

Github Repository: <https://github.com/erhant/frencurve>

## Preview Link

Live Preview: <https://frencurve.vercel.app/>

## Screenshots

![img](https://raw.githubusercontent.com/erhant/frencurve/refs/heads/main/img/Home.png)
