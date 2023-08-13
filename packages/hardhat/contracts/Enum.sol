// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.0;

/// @title Enum - Collection of enums
contract Enum {
    enum Operation {
        Call,
        DelegateCall
    }

    enum GrantStatus {
        Created, // 0
        Ongoing, // 1
        Payed, // 2
        Canceled //3
    }
}
