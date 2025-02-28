//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function mint(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IUniswap {

function addLiquidity(
    address tokenA,
    address tokenB,
    uint256 amountADesired,
    uint256 amountBDesired,
    uint256 amountAMin,
    uint256 amountBMin,
    address to,
    uint256 deadline
) external returns(uint256 amountA, uint256 amountB, uint256 liquidity);

 function getPair(address tokenA, address tokenB) external view returns (address pair);

 function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);

    function swapExactTokensForTokens(
    uint amountIn,
    uint amountOutMin,
    address[] calldata path,
    // address tokenA,
    // address tokenB,
    address to,
    uint deadline
) external returns (uint[] memory amounts);

}
interface IUniswapV2Factory {
    function getPair(address token0, address token1) external view returns (address);
}

contract TestAddLiquidity {

    

    // Uniswap factory contract Sepolia
    address private constant FACTORY = 0xF62c03E08ada871A0bEb309762E260a7a6a880E6;

    // Uniswap router contract Sepolia
    address private constant ROUTER = 0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3;

        function addLiquidity(
        address _tokenA,
        address _tokenB,
        uint256 _amountA,
        uint256 _amountB
    ) public returns(uint256, uint256, uint256) {

        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

        IERC20(_tokenA).approve(ROUTER, _amountA);
        IERC20(_tokenB).approve(ROUTER, _amountB);

        (uint256 amountA, uint256 amountB, uint256 liquidity) = 
            IUniswap(ROUTER).addLiquidity(
            _tokenA, 
            _tokenB, 
            _amountA, 
            _amountB, 
            0, // Minimum liquidity
            0, // Minimum liquidity
            msg.sender,
            block.timestamp + 86400);

        return (amountA, amountB, liquidity);

    }

      function removeLiquidity(
        address _tokenA,
        address _tokenB
    ) public returns(uint amountA, uint amountB) {

        // address pair = 0xbB6d2561a7543A8F6Ad9eFa787Ce7Ab3f2E5F3fC;
        address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);


        require(pair != address(0),"Pool not exist");
        uint liquidity = IERC20(pair).balanceOf(msg.sender);

        IERC20(pair).transferFrom(msg.sender, address(this),liquidity);

        IERC20(pair).approve(ROUTER, liquidity); //contract
     
        (amountA, amountB) = 
        IUniswap(ROUTER).removeLiquidity(
            _tokenA, _tokenB, liquidity, 1,1 , msg.sender, block.timestamp + 1 hours
        );

    }


    function swap(
        uint _amountIn,
        uint _amountOutMin, 
        address _tokenA, 
        address _tokenB, 
        address _to
    ) public payable returns (uint[] memory) {

        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountIn);

        IERC20(_tokenA).approve(ROUTER, _amountIn);

        address[] memory path = new address[](2);
        path[0] = _tokenA;
        path[1] = _tokenB;

        uint[] memory amounts = IUniswap(ROUTER).swapExactTokensForTokens(_amountIn, _amountOutMin, path, _to, block.timestamp + 500); 
        // uint[] memory amounts = IUniswap(ROUTER).swapExactTokensForTokens(_amountIn, _amountOutMin, path, _to, block.timestamp + 500);
        return amounts;
    }



}